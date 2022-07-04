import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { CouponsService } from 'src/app/core/services/coupons/coupons.service';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-form-add-pt-transactions',
  templateUrl: './form-add-pt-transactions.component.html',
  styleUrls: ['./form-add-pt-transactions.component.scss']
})
export class FormAddPtTransactionsComponent implements OnInit {
  @Input() userId: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  // 
  listClub: Club[] = [];
  listPaymentPlan: PaymentPlan[] = [];
  listPaymentMethod: any = [];
  listPtDebitTransaction: any = [];
  listCoupons: any = [];
  // Code Bên CRM Cũ
  manualPTPackageTransaction = '';
  isAllowChangeStartDate = false;
  isAllowEditStartDate = false;
  debitItemFee = 0;
  debitDiscountFee = 0;
  debitTotalFee = 0;
  needPaid = 0;
  disableSelectedCoupon = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private memberSvc: MemberService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    public translate: TranslateService,
    private shareSvc: ShareService,
    private couponSvc: CouponsService
  ) { }

  ngOnInit(): void {
    this._createForm();
    this._getListPtDebitTransaction();
    this._getListPaymentMethod();
    this._getListCoupons();
  }

  private _createForm() {
    this.form = this.fb.group({
      refTransactionId: [null, Validators.required],
      couponCode: [{ value: null, disabled: this.disableSelectedCoupon }],
      paymentMethod: ['CH', Validators.required],
      paymentAmount: [0, Validators.required],
    });
  }

  public onSubmit() {
    const options = {
      type: 'PT',
      accountId: this.userId,
    };
    if (this.form.valid) {
      this.spinner.show();
      if (
        this.debitTotalFee >=
        this.form.controls.paymentAmount.value
      ) {
        this.memberSvc.createManualTransaction(Object.assign(options, this.form.value))
          .subscribe(() => {
            this.debitItemFee = 0;
            this.debitTotalFee = 0;
            this.debitDiscountFee = 0;
            this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
            this.closeModal.emit(true);
            this.activeModal.dismiss();
            this.spinner.hide();
          }, () => this.spinner.hide());
      }
      return;
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  public updatePrice(transactionId: any) {
    if (transactionId) {
      this.memberSvc.getDetailPtDebitTransaction(transactionId).subscribe((res: any) => {
        if (res.data) {
          if (!res.data.couponCode) {
            this.checkValidCoupon(
              this.form.controls.couponCode.value
            );
            this.manualPTPackageTransaction = res.data.ptPackageId;
            this.debitItemFee = res.data.needPaid;
            this.debitTotalFee = this.debitItemFee - this.debitDiscountFee;
            this.needPaid = this.debitTotalFee;
            this.disableSelectedCoupon = false;
          } else {
            if (res.data.discount <= 0) {
              this.form.controls.couponCode.patchValue(
                res.data.couponCode
              );
              this.manualPTPackageTransaction = res.data.ptPackageId;
              this.checkValidCoupon(res.data.couponCode);
              this.debitItemFee = res.data.needPaid;
              this.debitTotalFee = this.debitItemFee - this.debitDiscountFee;
              this.disableSelectedCoupon = true;
            } else {
              this.form.controls.couponCode.patchValue(
                res.data.couponCode
              );
              this.debitDiscountFee = 0;
              this.debitItemFee = res.data.needPaid;
              this.debitTotalFee = this.debitItemFee - this.debitDiscountFee;
              this.disableSelectedCoupon = true;
            }
          }
          // Set needPaid 
          this.form.get('paymentAmount').setValue(this.needPaid);
        }
      });
    }

  }

  public checkValidCoupon(couponCode: string) {
    if (couponCode) {
      this.debitDiscountFee = 0;
      this.debitTotalFee = this.debitItemFee - this.debitDiscountFee;
      const options = {
        ptPackageId: this.manualPTPackageTransaction,
        couponCode: couponCode,
        paymentMethod:
          this.form.controls.paymentMethod.value,
      };
      this.couponSvc.checkValidCoupon(options).subscribe((res: any) => {
        if (res.data.isValidCoupon) {
          this.couponSvc.getCouponDetail(couponCode).subscribe((resp: any) => {
            if (resp.data.couponInfo.isDiscountByAmount) {
              this.debitDiscountFee = resp.data.couponInfo.discountAmount;
              this.debitTotalFee = this.debitItemFee - this.debitDiscountFee;
              this.needPaid = this.debitTotalFee;
            } else {
              this.debitDiscountFee =
                Math.floor(
                  (this.debitItemFee * resp.data.couponInfo.discountPercent) /
                  100 /
                  1000
                ) * 1000;
              this.debitTotalFee = this.debitItemFee - this.debitDiscountFee;
            }
          });
        }
      });
    }
    else {
      this.debitDiscountFee = 0;
      this.debitTotalFee = this.debitItemFee;
      this.needPaid = this.debitTotalFee;
    }
  }

  private _getListPtDebitTransaction() {
    this.memberSvc.getListPtDebitTransactions(this.userId).subscribe((res: any) => {
      this.listPtDebitTransaction = res.data;
    });
  }

  private _getListPaymentMethod() {
    this.shareSvc.getListPaymentMethod().subscribe((res: any) => {
      this.listPaymentMethod = res.data;
    });
  }

  private _getListCoupons() {
    this.shareSvc.getListCoupons().subscribe((res: any) => {
      this.listCoupons = res.data;
    });
  }
}
