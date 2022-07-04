import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { PtPackage } from 'src/app/core/models/share/pt-package.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { formatDate } from 'src/app/core/utils';

@Component({
  selector: 'app-form-edit-pt-contract',
  templateUrl: './form-edit-pt-contract.component.html',
  styleUrls: ['./form-edit-pt-contract.component.scss'],
})
export class FormEditPtContractComponent implements OnInit {
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Input() ptContractDetail: any;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateFormat = SystemConstant.TIME_FORMAT.YY_MM_DD;
  form: FormGroup;
  listPtPackage: PtPackage[] = [];
  listStatus = [
    SystemConstant.STATUS.CURRENT,
    SystemConstant.STATUS.PAST,
    SystemConstant.STATUS.WAITFORPAYMENT,
    SystemConstant.STATUS.FUTURE,
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private employeesSvc: EmployeesService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private shareSvc: ShareService,
    public translate: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this._getListPtPackage();
    this._createForm();
  }

  private _createForm(): void {
    const date = moment().format(this.dateFormat);
    const time = moment().format(this.timeFormat);
    this.form = this.fb.group({
      signDate: [date, Validators.required],
      signTime: [time, Validators.required],
      startDate: [date, Validators.required],
      startTime: [time, Validators.required],
      createdDate: [date, Validators.required],
      createdTime: [, Validators.required],
      endDate: [date, Validators.required],
      endTime: [time, Validators.required],
      status: [null, Validators.required],
      numOfCompletedSessions: [0, Validators.required],
      ptPackageId: [null, Validators.required],
    });
  }

  private _patchValue() {
    this.form.patchValue({
      signDate: moment(this.ptContractDetail.signDate).format(this.dateFormat),
      signTime: moment(this.ptContractDetail.signDate).format(this.timeFormat),
      startDate: moment(this.ptContractDetail.startDate).format(
        this.dateFormat
      ),
      startTime: moment(this.ptContractDetail.startDate).format(
        this.timeFormat
      ),
      createdDate: moment(this.ptContractDetail.createdAt).format(
        this.dateFormat
      ),
      createdTime: moment(this.ptContractDetail.createdAt).format(
        this.timeFormat
      ),
      endDate: moment(this.ptContractDetail.endDate).format(this.dateFormat),
      endTime: moment(this.ptContractDetail.endDate).format(this.timeFormat),
      status: this.ptContractDetail.status,
      numOfCompletedSessions: this.ptContractDetail.numOfCompletedSessions,
      ptPackageId: this.ptContractDetail.ptPackageId,
    });
  }

  private _getListPtPackage() {
    this.shareSvc.getPtListPackage().subscribe((res: any) => {
      this.listPtPackage = res.data;
      if (this.listPtPackage) {
        this._patchValue();
      }
    });
  }

  public editPtContract() {
    this.spinner.show();
    const form = this.form.controls;
    if (this.form.valid) {
      const options = {
        ptContractId: this.ptContractDetail.id,
        signDate: formatDate(form.signDate, form.signTime),
        startDate: formatDate(form.startDate, form.startTime),
        endDate: formatDate(form.endDate, form.endTime),
        createdAt: formatDate(form.createdDate, form.createdTime),
        numOfCompletedSessions: form.numOfCompletedSessions.value,
        status: form.status.value,
        ptPackageId: form.ptPackageId.value,
      };
      this.employeesSvc.editPtContract(options).subscribe(
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
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
