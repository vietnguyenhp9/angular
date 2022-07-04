import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-form-add-member-contract',
  templateUrl: './form-add-member-contract.component.html',
  styleUrls: ['./form-add-member-contract.component.scss']
})
export class FormAddMemberContractComponent implements OnInit {
  @Input() userId: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  // 
  listClub: Club[] = [];
  listPaymentPlan: PaymentPlan[] = [];
  selectedPaymentPlan = '';
  // 
  isAllowChangeStartDate = false;
  now = new Date().toISOString().split('T')[0];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberSvc: MemberService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    public translate: TranslateService,
    private shareSvc: ShareService
  ) { }

  ngOnInit(): void {
    this._createForm();
    this._getListClub();
    this._getLastMemberContract();
  }

  private _createForm() {
    const today = moment().format(SystemConstant.TIME_FORMAT.YY_MM_DD);
    this.form = this.fb.group({
      clubId: [null, Validators.required],
      signDate: [today, Validators.required],
      startDate: [today, Validators.required],
      paymentPlanId: [null, [Validators.required]],
      quantity: ['1'],
      accountId: [this.userId, Validators.required],
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      this.memberSvc.createMemberContract(this.form.value)
        .subscribe(() => {
          this._getLastMemberContract();
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  private _getListClub() {
    this.shareSvc.getListClub().subscribe((res: any) => {
      this.listClub = res.data;
    });
  }

  public getListPaymentPlanByClub(clubId: string) {
    this.spinner.show();
    this.form.get('paymentPlanId').setValue(null);
    this.shareSvc.getListPaymentPlanByClub(clubId).subscribe((res: any) => {
      this.listPaymentPlan = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private _getLastMemberContract() {
    this.memberSvc.getLastMemberContract(this.userId).subscribe((res: any) => {
      if (res.data && (res.data.status === 'FUTURE' || res.data.status === 'CURRENT')) {
        this.isAllowChangeStartDate = false;
      } else {
        this.isAllowChangeStartDate = true;
      }
    });
  }
}
