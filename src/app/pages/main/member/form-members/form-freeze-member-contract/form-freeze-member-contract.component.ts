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

@Component({
  selector: 'app-form-freeze-member-contract',
  templateUrl: './form-freeze-member-contract.component.html',
  styleUrls: ['./form-freeze-member-contract.component.scss']
})
export class FormFreezeMemberContractComponent implements OnInit {
  @Input() userId: string;
  @Input() contractId: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  // 
  listClub: Club[] = [];
  listPaymentPlan: PaymentPlan[] = [];
  selectedPaymentPlan = '';
  // Code Bên CRM Cũ
  now = new Date();
  minStartDate = this.now.toISOString().split('T')[0];
  moreDate = this.now.setDate(this.now.getDate() + 1);
  minEndDate = this.now.toISOString().split('T')[0];
  maxEndDate = moment(this.now)
    .endOf('month')
    .add(3, 'month')
    .toISOString()
    .split('T')[0];


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberSvc: MemberService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    const today = moment();
    this.form = this.fb.group({
      startDate: [today.format(SystemConstant.TIME_FORMAT.YY_MM_DD), [Validators.required]],
      endDate: [today.add(1, 'day').format(SystemConstant.TIME_FORMAT.YY_MM_DD), [Validators.required]],
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      const model = {
        memberContractId: this.contractId,
        startDate: moment(this.form.controls.startDate.value),
        endDate: moment(this.form.controls.endDate.value),
      };
      this.memberSvc.freezeMemberContract(this.userId, model)
        .subscribe(() => {
          this.alert.success(this.translate.instant('FORM.FREEZE_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
          this.spinner.hide();
        }, () => this.spinner.hide());
    }
    else {
      this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
    }
  }


  public onChangeStartDate() {
    const startDate = this.form.controls.startDate.value;
    const endDate = this.form.controls.endDate.value;
    if (startDate >= endDate) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + 1);
      this.minEndDate = date.toISOString().split('T')[0];
      this.form.controls.endDate.setValue(
        moment(date).format('YYYY-MM-DD')
      );
    } else {
      const date = new Date(startDate);
      date.setDate(date.getDate() + 1);
      this.minEndDate = date.toISOString().split('T')[0];
    }
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}

