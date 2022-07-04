import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { formatDate, getDataSelect } from 'src/app/core/utils';

@Component({
  selector: 'app-form-edit-member-contract',
  templateUrl: './form-edit-member-contract.component.html',
  styleUrls: ['./form-edit-member-contract.component.scss'],
})
export class FormEditMemberContractComponent implements OnInit {
  @Input() contractId: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  //
  listClub: Club[] = [];
  listPaymentPlan: PaymentPlan[] = [];
  contractDetail: any;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateFormat = SystemConstant.TIME_FORMAT.YY_MM_DD;
  listStatus = [
    SystemConstant.STATUS.CURRENT,
    SystemConstant.STATUS.PAST,
    SystemConstant.STATUS.WAITFORPAYMENT,
    SystemConstant.STATUS.FUTURE,
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private employeesSvc: EmployeesService,
    private shareSvc: ShareService,
    private alert: ToastrService,
    private fb: FormBuilder,
    public translate: TranslateService,
    public activeModal: NgbActiveModal
  ) {}

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this._getContractDetailById();
    this._createForm();
  }

  public async onChangeClub(clubId: string) {
    this.form.get('paymentPlanId').setValue('');
    this.listPaymentPlan = await getDataSelect(
      this.shareSvc.getListPaymentPlanByClub(clubId)
    );
  }

  private _getContractDetailById() {
    this.spinner.show();
    this.employeesSvc.getMemberContractDetailById(this.contractId).subscribe(
      async (res: any) => {
        this.contractDetail = res.data;
        const { clubId } = res.data;
        if (res) {
          this.listPaymentPlan = await getDataSelect(
            this.shareSvc.getListPaymentPlanByClub(clubId)
          );
          this._patchValue();
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  private _createForm(): void {
    this.form = this.fb.group({
      signDate: ['', Validators.required],
      signTime: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      createDate: [''],
      createTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      status: [null, Validators.required],
      clubId: [null, Validators.required],
      paymentPlanId: [null, Validators.required],
    });
  }

  private _patchValue() {
    this.form.patchValue({
      id: this.contractDetail.id,
      signDate: moment(this.contractDetail.signDate).format(this.dateFormat),
      signTime: moment(this.contractDetail.signDate).format(this.timeFormat),
      startDate: moment(this.contractDetail.startDate).format(this.dateFormat),
      startTime: moment(this.contractDetail.startDate).format(this.timeFormat),
      createDate: moment(this.contractDetail.createdAt).format(this.dateFormat),
      createTime: moment(this.contractDetail.createdAt).format(this.timeFormat),
      endDate: moment(this.contractDetail.endDate).format(this.dateFormat),
      endTime: moment(this.contractDetail.endDate).format(this.timeFormat),
      status: this.contractDetail.status,
      clubId: this.contractDetail.clubId,
      paymentPlanId: this.contractDetail.paymentPlanId,
    });
  }

  public editMemberContract() {
    this.spinner.show();
    const form = this.form.controls;
    if (this.form.valid) {
      const options = {
        contractId: this.contractId,
        signDate: formatDate(form.signDate, form.signTime),
        startDate: formatDate(form.startDate, form.startTime),
        endDate: formatDate(form.endDate, form.endTime),
        status: form.status.value,
        clubId: form.clubId.value,
        paymentPlanId: form.paymentPlanId.value,
      };
      this.employeesSvc.editMemberContract(this.contractId, options).subscribe(
        (res: any) => {
          if (res) {
            this.activeModal.dismiss();
            this.closeModal.emit(true);
            this.alert.success(this.translate.instant('FORM.UPDATE_SUCCESS'));
          }
          this.spinner.hide();
        },
        () => this.spinner.hide()
      );
      return;
    }
    this.spinner.hide();
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel() {
    this.activeModal.dismiss();
    this.closeModal.emit(false);
  }
}
