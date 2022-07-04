import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { omitBy, isNil } from 'lodash';
import { Query } from 'src/app/core/models/share/query.model';
import { ReportCustomerService } from 'src/app/core/services/reports/report-customer.service';
import { exportExcel, getDataSelect, getPage } from 'src/app/core/utils';
import { ReportRevenueService } from 'src/app/core/services/reports/report-revenue.service';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';


@Component({
  selector: 'app-report-customer-active-unuse',
  templateUrl: './report-customer-active-unuse.component.html',
  styleUrls: ['./report-customer-active-unuse.component.scss']
})
export class ReportCustomerActiveUnuseComponent implements OnInit {
  @Input() hyperLinkMemberCustomer: any;
  @Input() userInfo: UserProfile;
  @Input() listClub: Club[];
  // 
  listPaymentPlan: PaymentPlan[];
  listCustomerActiveUnuse = [];
  clubId: number;
  paymentPlanId: number;
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  isExport = false;
  // Sort
  objSort: any = {};
  checkedAsc = false;
  checkedDesc = false;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Filter
  selectedClub: number;
  selectedPaymentPlan: number;
  isDisableSelected: boolean;
  numUnuseDay: number;


  constructor(
    public translate: TranslateService,
    private reportCustomerSvc: ReportCustomerService,
    private reportRevenueSvc: ReportRevenueService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this._getListActivePaymentPlanForSelect();
    this.getListCustomerActiveUnuse();
  }

  private async _getListActivePaymentPlanForSelect(options?: Query) {
    options = {
      isActive: 1,
      isAll: true,
      clubId: this.clubId
    }
    this.listPaymentPlan = await getDataSelect(this.reportRevenueSvc.getListActivePaymentMethod(omitBy(options, isNil)));
  }

  public onSearchByDay() {
    this.page = 1;
    this.getListCustomerActiveUnuse();
  }

  public onChangeClub(selectedClub: any) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.paymentPlanId = this.selectedPaymentPlan = null;
      this.page = 1;
      this._getListActivePaymentPlanForSelect();
      this.getListCustomerActiveUnuse();
    }
  }

  public onChangePaymentPlans(selectedPaymentPlan: number) {
    if (![undefined, this.paymentPlanId].includes(selectedPaymentPlan)) {
      this.paymentPlanId = selectedPaymentPlan;
      this.page = 1;
      this.getListCustomerActiveUnuse();
    }
  }

  public async getListCustomerActiveUnuse(options: Query = {}) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      paymentPlanId: this.paymentPlanId,
      numUnuseDay: this.numUnuseDay,
      order: Object.values(this.objSort).join(',') || null,
      page: this.page,
      limit: this.pageSize,
    };
    if (!this.isExport) {
      this.reportCustomerSvc
        .getListCustomerActiveUnuse(omitBy(options, isNil))
        .subscribe((resp: any) => {
          this.total = resp.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.listCustomerActiveUnuse = resp.data.result;
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.isExport = this.isExport;
    this.isExport = false;
    return this.reportCustomerSvc
      .getListCustomerActiveUnuse(omitBy(options, isNil))
      .toPromise();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListCustomerActiveUnuse();
  }

  private _deleteKeySort() {
    delete this.objSort['type'];
  }

  public addKeySort(type: string) {
    if (!type) {
      return;
    }
    this.objSort = {
      type,
    };
  }

  public sortData(typeSort: string) {
    const checkedValue = {
      ASC: () => {
        this.checkedAsc = !this.checkedAsc;
        this.checkedDesc = this.checkedAsc && false;
        !this.checkedAsc
          ? this._deleteKeySort()
          : this.addKeySort(typeSort);
      },
      DESC: () => {
        this.checkedDesc = !this.checkedDesc;
        this.checkedAsc = this.checkedDesc && false;
        !this.checkedDesc
          ? this._deleteKeySort()
          : this.addKeySort(typeSort);
      },
    };
    checkedValue[typeSort]();
    this.page = 1;
    this.getListCustomerActiveUnuse();
  }

  // Export file report
  public async exportExcelCustomerActiveUnuse() {
    this.isExport = true;
    const dataExport: any = await this.getListCustomerActiveUnuse();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-customer-customer-unuse.xlsx");
      this.spinner.hide();
    }
  }
}
