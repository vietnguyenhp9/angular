import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { omitBy, isNil } from 'lodash';
import { Query } from 'src/app/core/models/share/query.model';
import { ReportCustomerService } from 'src/app/core/services/reports/report-customer.service';
import { exportExcel, getDataSelect, getPage, getTimeFormat } from 'src/app/core/utils';
import * as moment from 'moment';
import { ReportRevenueService } from 'src/app/core/services/reports/report-revenue.service';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';


@Component({
  selector: 'app-report-customer-expiring',
  templateUrl: './report-customer-expiring.component.html',
  styleUrls: ['./report-customer-expiring.component.scss']
})
export class ReportCustomerExpiringComponent implements OnInit {
  @Input() listClub: Club[];
  @Input() userInfo: UserProfile;
  @Input() hyperLinkMemberCustomer: any;
  //
  listPaymentPlan: PaymentPlan[];
  listCustomerExpiring = [];
  clubId: number;
  paymentPlanId: number;
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
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
  selectedDateTime: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  isDisableSelected: boolean;
  startDate: moment.Moment = null;
  endDate: moment.Moment = null;
  numRemainingDay: number;

  constructor(
    public translate: TranslateService,
    private reportRevenueSvc: ReportRevenueService,
    private reportCustomerSvc: ReportCustomerService,
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
    this.getListCustomerExpiring();
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
    this.getListCustomerExpiring();
  }

  public onFilterDateChange(event: any) {
    const { startDate, endDate } = event;
    const sdIsOldValue = [this.startDate].includes(startDate);
    const edIsOldValue = [this.endDate].includes(endDate);
    if (sdIsOldValue && edIsOldValue) {
      return;
    }
    this.page = 1;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.getListCustomerExpiring();
  }

  public onChangeClub(selectedClub: any) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.paymentPlanId = this.selectedPaymentPlan = null;
      this.page = 1;
      this._getListActivePaymentPlanForSelect();
      this.getListCustomerExpiring();
    }
  }

  public onChangePaymentPlans(selectedPaymentPlan: number) {
    if (![undefined, this.paymentPlanId].includes(selectedPaymentPlan)) {
      this.paymentPlanId = selectedPaymentPlan;
      this.page = 1;
      this.getListCustomerExpiring();
    }
  }

  public async getListCustomerExpiring(options: Query = {}) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      paymentPlanId: this.paymentPlanId,
      numRemainingDay: this.numRemainingDay,
      order: Object.values(this.objSort).join(',') || null,
      startDate: getTimeFormat(this.startDate),
      endDate: getTimeFormat(this.endDate),
      page: this.page,
      limit: this.pageSize,
    };
    if (!this.isExport) {
      this.reportCustomerSvc
        .getListCustomerExpiring(omitBy(options, isNil))
        .subscribe((resp: any) => {
          this.total = resp.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.listCustomerExpiring = resp.data.result;
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.isExport = this.isExport;
    this.isExport = false;
    return this.reportCustomerSvc
      .getListCustomerExpiring(omitBy(options, isNil))
      .toPromise();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListCustomerExpiring();
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
    this.getListCustomerExpiring();
  }

  // Export file report
  public async exportExcelCustomerExpiring() {
    this.isExport = true;
    const dataExport: any = await this.getListCustomerExpiring();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-customer-expiring.xlsx");
      this.spinner.hide();
    }
  }

}
