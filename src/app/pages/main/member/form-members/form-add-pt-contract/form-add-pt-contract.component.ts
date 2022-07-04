import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { PtPackage } from 'src/app/core/models/share/pt-package.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { uniqBy } from 'lodash'

@Component({
  selector: 'app-form-add-pt-contract',
  templateUrl: './form-add-pt-contract.component.html',
  styleUrls: ['./form-add-pt-contract.component.scss']
})
export class FormAddPtContractComponent implements OnInit {
  @Input() userId: string;
  @Input() currentClubId: number;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  // 
  listClub = [];
  listPaymentPlan: PaymentPlan[] = [];
  listPtPakageByClub: PtPackage[] = [];
  selectedPaymentPlan = '';
  selectedClub: any;
  listPtByClub = [];
  // 
  allowSelectPT = false;
  ptName: string;
  ptId: string;
  clubId: number;



  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberSvc: MemberService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    public translate: TranslateService,
    private shareSvc: ShareService
  ) { }

  ngOnInit() {
    this._createForm();
    this._getListPtPackageByClub();
    this._getInfoPtBooking();
    this._getListClub();
  }

  private _createForm() {
    this.form = this.fb.group({
      accountId: [this.userId, [Validators.required]],
      ptId: [null, [Validators.required]],
      ptPackageId: [null, [Validators.required]]
    });
  }

  private _getListClub() {
    this.memberSvc.getListMemberContracts(this.userId).subscribe((res: any) => {
      this.listClub = uniqBy(res.data.result, 'clubId');
    })
  }

  private _getListPtPackageByClub() {
    this.shareSvc.getListPtPackageByClub(this.currentClubId).subscribe((res: any) => {
      this.listPtPakageByClub = res.data;
    });
  }

  private _getInfoPtBooking() {
    this.memberSvc.getMemberPtBooking(this.userId).subscribe((res: any) => {
      if (res.data) {
        this.ptName = res.data.ptName;
        this.ptId = res.data.ptInfoId;
        this.form.get('ptId').setValue(this.ptId);
        return;
      }
      this.allowSelectPT = true;
    }, () => this.allowSelectPT = true);
  }

  private _getListPt(clubId: number) {
    this.shareSvc.getListPtByClub(clubId).subscribe((res: any) => {
      this.listPtByClub = res.data;
    });
  }
  public onChangeClub(selectedClub: any) {
    this.clubId = selectedClub
    this._getListPt(this.clubId);
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      this.memberSvc.createPtContract(this.form.value)
        .subscribe(() => {
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
}
