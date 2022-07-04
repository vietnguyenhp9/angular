import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PtPackage } from 'src/app/core/models/share/pt-package.model';
import { Query } from 'src/app/core/models/share/query.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { FormAddPtContractComponent } from '../form-members/form-add-pt-contract/form-add-pt-contract.component';
import { FormAddPtTransactionsComponent } from '../form-members/form-add-pt-transactions/form-add-pt-transactions.component';
import { FormEditPtContractComponent } from '../form-members/form-edit-pt-contract/form-edit-pt-contract.component';
import { FormEditPtTransactionsComponent } from '../form-members/form-edit-pt-transactions/form-edit-pt-transactions.component';
import { FormTransferPtContractLogComponent } from '../form-members/form-transfer-pt-contract-log/form-transfer-pt-contract-log.component';
import { FormTransferPtContractComponent } from '../form-members/form-transfer-pt-contract/form-transfer-pt-contract.component';

@Component({
  selector: 'app-member-tab-pt-contract',
  templateUrl: './member-tab-pt-contract.component.html',
  styleUrls: ['./member-tab-pt-contract.component.scss'],
})
export class MemberTabPtContractComponent implements OnInit {
  @Input() userId: string;
  @Input() currentClubId: string;
  listPtContracts = [];
  listPtTransactions = [];
  listPackage: PtPackage[] = [];
  listClub: Club[] = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  systemConstant = SystemConstant.STATUS;
  isAllowAddContract = false;
  // Filter
  selectedClub: number;
  selectedPackage: number;
  isDisableSelected: boolean;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSizeContracts = SystemConstant.PAGING.PAGESIZE;
  pageSizeTransactions = SystemConstant.PAGING.PAGESIZE;
  // Query
  clubId: number;
  ptPackageId: number;

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
    this.getListPtContracts(this.userId);
    this.isAllowAddContract = this.currentClubId ? true : false;
  }

  private _getListPtPackage(clubId: number) {
    this.spinner.show();
    this.shareSvc.getListPtPackageByClub(clubId).subscribe(
      (res: any) => {
        this.listPackage = res.data;
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  public loadNext(page: number, type: string) {
    this.page = page;
    const _type = {
      Contracts: () => {
        this.getListPtContracts(this.userId);
      },
      Transactions: () => {
        this.getListPtTransactions(this.userId);
      },
    };
    return _type[type]();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.ptPackageId = this.selectedPackage = null;
      this.listPackage = [];
      this.page = 1;
      this.getListPtContracts(this.userId);
      if (this.clubId !== null) {
        this._getListPtPackage(this.clubId);
      }
    }
  }

  public onChangePackage(selectedPackage: number) {
    if (![undefined, this.ptPackageId].includes(selectedPackage)) {
      this.ptPackageId = selectedPackage;
      this.page = 1;
      this.getListPtContracts(this.userId);
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
        WAITPTCONFIRM: SystemConstant.CLASS_STATUS.WAITPTCONFIRM,
      };
      return typeClass[memberData.status];
    }
    return SystemConstant.CLASS_STATUS.DEFAULT;
  }

  public getListPtContracts(userId: string, options?: Query) {
    this.spinner.show();
    options = {
      ptPackageId: this.ptPackageId,
      clubId: this.clubId,
      page: this.page,
      limit: this.pageSizeContracts,
    };
    this.memberSvc.getListPtContracts(userId, omitBy(options, isNil)).subscribe(
      (res: any) => {
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSizeContracts);
        this.listPtContracts = res.data.result.map((item: any) => ({
          ...item,
          classMember: this.getMemberClass(item),
          isAllowConfirm: item.status !== this.systemConstant.WAITPTCONFIRM,
          isAllowTransfer: [
            this.systemConstant.CURRENT,
            this.systemConstant.FUTURE,
          ].includes(item.status),
        }));
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  // --------------- //
  public getListPtTransactions(userId: string, options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSizeTransactions,
    };
    this.memberSvc
      .getListPtTransactions(userId, omitBy(options, isNil))
      .subscribe(
        (res: any) => {
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSizeTransactions);
          this.listPtTransactions = res.data.result.map((item: any) => ({
            ...item,
            debit:
              item.status === SystemConstant.STATUS.DEBIT
                ? item.transactionAmount
                : '',
            transactionAmount:
              item.status !== SystemConstant.STATUS.DEBIT
                ? item.transactionAmount
                : '',
            paymentMethodName: SystemConstant.METHOD_TYPE[item.paymentMethod],
          }));
          this.spinner.hide();
        },
        () => this.spinner.hide()
      );
  }

  // Open Modal Add New Contract & Transactions
  public addPtContract() {
    const modalRef = this.modalSvc.open(FormAddPtContractComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.currentClubId = this.currentClubId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtContracts(this.userId) : {};
    });
  }

  public addPtTransaction() {
    const modalRef = this.modalSvc.open(FormAddPtTransactionsComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtTransactions(this.userId) : {};
    });
  }

  public confirmPtContract(contractId: string) {
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_CONTRACT';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._confirmContract(contractId) : {};
    });
  }

  public editMemberPtTransaction(ptTransactions: any) {
    const modalRef = this.modalSvc.open(FormEditPtTransactionsComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.ptTransactions = ptTransactions;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtTransactions(this.userId) : {};
    });
  }

  public editMemberPtContract(ptContractDetail: any) {
    const modalRef = this.modalSvc.open(FormEditPtContractComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.ptContractDetail = ptContractDetail;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtContracts(this.userId) : {};
    });
  }

  public deletePtContract(contractId: string) {
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_CONTRACT';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deletePtContract(contractId) : {};
    });
  }

  public deletePtTransaction(transactionId: string) {
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_TRANSACTION';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deletePtTransaction(transactionId) : {};
    });
  }

  private _confirmContract(contractId: string) {
    this.spinner.show();
    this.memberSvc.confirmContract(contractId).subscribe(
      (res) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.UPDATE_SUCCESS'));
          this.getListPtContracts(this.userId);
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  private _deletePtContract(contractId: string) {
    this.spinner.show();
    this.memberSvc.deletePtContract(contractId).subscribe(
      (res) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
          this.getListPtContracts(this.userId);
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  private _deletePtTransaction(transactionId: string) {
    this.spinner.show();
    this.memberSvc.deletePtTransaction(transactionId).subscribe(
      (res) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
          this.getListPtTransactions(this.userId);
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  public transferPtContract(item: any) {
    const modalRef = this.modalSvc.open(FormTransferPtContractComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.TRANSFER_PT_CONTRACT';
    modalRef.componentInstance.itemContract = item;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtContracts(this.userId) : {};
    });
  }

  public tranferPTContractLog(item: any) {
    const modalRef = this.modalSvc.open(FormTransferPtContractLogComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.TRANSFER_PT_CONTRACT_LOG';
    modalRef.componentInstance.ptContractId = item.id;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtContracts(this.userId) : {};
    });
  }
}
