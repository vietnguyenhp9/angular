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
  selector: 'app-report-customer-active',
  templateUrl: './report-customer-active.component.html',
  styleUrls: ['./report-customer-active.component.scss']
})
export class ReportCustomerActiveComponent implements OnInit {
  @Input() listClub: Club[];
  @Input() userInfo: UserProfile;
  @Input() hyperLinkMemberCustomer: any;
  // 
  listPaymentPlan: PaymentPlan[];
  listCustomerActive = [];
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
  expiredDay: number;


  constructor(
    public translate: TranslateService,
    private reportCustomerSvc: ReportCustomerService,
    private reportRevenueSvc: ReportRevenueService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this._getListActivePaymentPlanForSelect();
    this.getListCustomerActive();
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
    this.getListCustomerActive();
  }

  public onChangeClub(selectedClub: any) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.paymentPlanId = this.selectedPaymentPlan = null;
      this.clubId = selectedClub;
      this.page = 1;
      this._getListActivePaymentPlanForSelect();
      this.getListCustomerActive();
    }
  }

  public onChangePaymentPlans(selectedPaymentPlan: number) {
    if (![undefined, this.paymentPlanId].includes(selectedPaymentPlan)) {
      this.paymentPlanId = selectedPaymentPlan;
      this.page = 1;
      this.getListCustomerActive();
    }
  }

  public async getListCustomerActive(options: Query = {}) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      paymentPlanId: this.paymentPlanId,
      expiredDay: this.expiredDay,
      order: Object.values(this.objSort).join(',') || null,
      page: this.page,
      limit: this.pageSize,
    };
    if (!this.isExport) {
      this.reportCustomerSvc
        .getListCustomerActive(omitBy(options, isNil))
        .subscribe((resp: any) => {
          this.total = resp.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.listCustomerActive = resp.data.result;
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.isExport = this.isExport;
    this.isExport = false;
    return this.reportCustomerSvc
      .getListCustomerActive(omitBy(options, isNil))
      .toPromise();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListCustomerActive();
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
    this.getListCustomerActive();
  }

  // Export file report
  public async exportExcelCustomerActive() {
    this.isExport = true;
    const dataExport: any = await this.getListCustomerActive();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-customer-active.xlsx");
      this.spinner.hide();
    }
  }
}
