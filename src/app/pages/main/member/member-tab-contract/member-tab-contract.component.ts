import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { Query } from 'src/app/core/models/share/query.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { FormAddMemberContractComponent } from '../form-members/form-add-member-contract/form-add-member-contract.component';
import { FormAddMemberTransactionsComponent } from '../form-members/form-add-member-transactions/form-add-member-transactions.component';
import { FormEditMemberContractComponent } from '../form-members/form-edit-member-contract/form-edit-member-contract.component';
import { FormEditMemberTransactionsComponent } from '../form-members/form-edit-member-transactions/form-edit-member-transactions.component';
import { FormFreezeMemberContractComponent } from '../form-members/form-freeze-member-contract/form-freeze-member-contract.component';

@Component({
  selector: 'app-member-tab-contract',
  templateUrl: './member-tab-contract.component.html',
  styleUrls: ['./member-tab-contract.component.scss'],
})
export class MemberTabContractComponent implements OnInit {
  @Input() userId: string;
  listMemberContracts = [];
  listMemberTransactions = [];
  listClub: Club[] = [];
  listPaymentPlan: PaymentPlan[] = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  systemConstant = SystemConstant.STATUS;
  // Filter
  selectedClub: number;
  selectedPaymentPlan: number;
  isDisableSelected: boolean;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSizeContracts = SystemConstant.PAGING.PAGESIZE;
  pageSizeTransactions = SystemConstant.PAGING.PAGESIZE;
  // Query
  clubId: number;
  paymentPlanId: number;
  constructor(
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    private shareSvc: ShareService,
    public translate: TranslateService,
    private modalSvc: NgbModal,
    private alert: ToastrService
  ) {}

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this.getListMemberContracts(this.userId);
  }

  private _getListPaymentPlan(clubId: number) {
    this.spinner.show();
    this.shareSvc.getListPaymentPlanByClub(clubId.toString()).subscribe(
      (res: any) => {
        this.listPaymentPlan = res.data;
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  public loadNext(page: number, type: string) {
    this.page = page;
    const _type = {
      Contracts: () => {
        this.getListMemberContracts(this.userId);
      },
      Transactions: () => {
        this.getListMemberTransactions(this.userId);
      },
    };
    return _type[type]();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.paymentPlanId = this.selectedPaymentPlan = null;
      this.listPaymentPlan = [];
      this.page = 1;
      this.getListMemberContracts(this.userId);
      this._getListPaymentPlan(this.clubId);
    }
  }

  public onChangePaymentPlan(selectedPaymentPlan: number) {
    if (![undefined, this.paymentPlanId].includes(selectedPaymentPlan)) {
      this.paymentPlanId = selectedPaymentPlan;
      this.page = 1;
      this.getListMemberContracts(this.userId);
    }
  }

  public getMemberClass(memberData: any) {
    if (memberData.isFrozen) {
      return SystemConstant.CLASS_STATUS.FREEZED;
    }
    if (memberData.status) {
      const typeClass = {
        CURRENT: SystemConstant.CLASS_STATUS.CURRENT,
        FUTURE: SystemConstant.CLASS_STATUS.FUTURE,
        PAST: SystemConstant.CLASS_STATUS.PAST,
        WAITFORPAYMENT: SystemConstant.CLASS_STATUS.WAITFORPAYMENT,
      };
      return typeClass[memberData.status];
    }
    return SystemConstant.CLASS_STATUS.DEFAULT;
  }

  private _checkAllowFreezeContract(contract: any) {
    if (contract.status === this.systemConstant.CURRENT) {
      const conditions1 =
        contract.isFrozen === false && contract.freezeStartDate === null;
      const conditions2 =
        contract.isFrozen === false &&
        contract.freezeStartDate !== null &&
        contract.freezeReason === this.systemConstant.WAITFORPAYMENT;
      return conditions1 || conditions2;
    }
    return false;
  }

  private _checkAllowUnfreezeContract(contract: any) {
    const conditions1 = contract.isFrozen === true;
    const conditions2 =
      contract.freezeStartDate !== null &&
      contract.freezeReason !== this.systemConstant.WAITFORPAYMENT;
    return conditions1 || conditions2;
  }

  public getListMemberContracts(userId: string, options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      paymentPlanId: this.paymentPlanId,
      page: this.page,
      limit: this.pageSizeContracts,
    };
    this.memberSvc
      .getListMemberContracts(userId, omitBy(options, isNil))
      .subscribe(
        (res: any) => {
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSizeContracts);
          this.listMemberContracts = res.data.result.map((item: any) => ({
            ...item,
            classMember: this.getMemberClass(item),
            isAllowFreeze: this._checkAllowFreezeContract(item),
            isAllowUnfreeze: this._checkAllowUnfreezeContract(item),
          }));
          this.spinner.hide();
        },
        () => this.spinner.hide()
      );
  }

  public getListMemberTransactions(userId: string, options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSizeTransactions,
    };
    this.memberSvc
      .getListMemberTransactions(userId, omitBy(options, isNil))
      .subscribe(
        (res: any) => {
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSizeTransactions);
          this.listMemberTransactions = res.data.result.map((item: any) => ({
            ...item,
            debit:
              item.status === SystemConstant.STATUS.DEBIT
                ? item.transactionAmount
                : null,
            transactionAmount:
              item.status !== SystemConstant.STATUS.DEBIT
                ? item.transactionAmount
                : null,
            paymentMethodName: SystemConstant.METHOD_TYPE[item.paymentMethod],
            isAllowDelete:
              item.paymentType !== this.systemConstant.FREEZE_CONTRACT,
          }));
          this.spinner.hide();
        },
        () => this.spinner.hide()
      );
  }

  // Open Modal Add New Contract & Transactions
  public editMemberContract(contractId: string) {
    const modalRef = this.modalSvc.open(FormEditMemberContractComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.contractId = contractId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListMemberContracts(this.userId) : {};
    });
  }

  public editMemberTransaction(memberTransactions: any) {
    const modalRef = this.modalSvc.open(FormEditMemberTransactionsComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.memberTransactions = memberTransactions;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListMemberTransactions(this.userId) : {};
    });
  }

  public addMemberContract() {
    const modalRef = this.modalSvc.open(FormAddMemberContractComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListMemberContracts(this.userId) : {};
    });
  }

  public addMemberTransaction() {
    const modalRef = this.modalSvc.open(FormAddMemberTransactionsComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListMemberTransactions(this.userId) : {};
    });
  }

  public deleteMemberContract(contractId: string) {
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_TRANSACTION';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteMemberContract(contractId) : {};
    });
  }

  public freezeMemberContract(contractId: string) {
    const modalRef = this.modalSvc.open(FormFreezeMemberContractComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.contractId = contractId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListMemberContracts(this.userId) : {};
    });
  }

  public unfreezeMemberContract(contractId: string) {
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.UNFREEZE_CONTRACT';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res
        ? this._unFreezeMemberContract(this.userId, {
            memberContractId: contractId,
          })
        : {};
    });
  }

  public deleteMemberTransaction(transactionId: string) {
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_TRANSACTION';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteMemberTransaction(transactionId) : {};
    });
  }

  private _deleteMemberContract(contractId: string) {
    this.spinner.show();
    this.memberSvc.deleteMemberContract(contractId).subscribe(
      (res) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
          this.getListMemberContracts(this.userId);
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  private _deleteMemberTransaction(transactionId: string) {
    this.spinner.show();
    this.memberSvc.deleteMemberTransaction(transactionId).subscribe(
      (res) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
          this.getListMemberTransactions(this.userId);
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  private _unFreezeMemberContract(userId: string, model: any) {
    this.spinner.show();
    this.memberSvc.unfreezeMemberContract(userId, model).subscribe(
      (res) => {
        if (res) {
          this.alert.success(
            this.translate.instant('FORM.UNFREEZE_CONTRACT_SUCCESS')
          );
          this.getListMemberContracts(this.userId);
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }
}
