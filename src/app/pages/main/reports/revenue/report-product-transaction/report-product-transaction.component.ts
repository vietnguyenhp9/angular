import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ReportRevenueService } from 'src/app/core/services/reports/report-revenue.service';
import { isNil, omitBy } from 'lodash';
import { Query } from 'src/app/core/models/share/query.model';
import { exportExcel, getPage } from 'src/app/core/utils';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentMethod } from 'src/app/core/models/share/payment-method.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-report-product-transaction',
  templateUrl: './report-product-transaction.component.html',
  styleUrls: ['./report-product-transaction.component.scss']
})
export class ReportProductTransactionComponent implements OnInit {
  // Select data
  @Input() listClub: Club[];
  @Input() listPaymentMethod: PaymentMethod[];
  @Input() userInfo: UserProfile;
  // List
  listProductTransaction = [];
  totalRevenue = 0;
  // Format
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Filter
  selectedClub: number;
  selectedPaymentMethod: number;
  orderRefSearch: string;
  selectedDateTime: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  selectedType = 'day';
  isDisableSelected: boolean;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Query
  now = new Date().toISOString().split('T')[0];
  today: any = moment().format('YYYY-MM-DD');
  startDate: moment.Moment;
  endDate: moment.Moment;
  status: string;
  isFrozen = false;
  clubId: number;
  clubKey: string;
  paymentMethod: string;

  constructor(
    private reportRevenueSvc: ReportRevenueService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
  ) {
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.selectedDateTime = {
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  async ngOnInit() {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getProductTransaction();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getProductTransaction();
  }

  public onChangePage(page: number) {
    if (page) {
      this.page = page;
      this.getProductTransaction();
    }
  }

  public onChangeClub(selectedClub: any) {
    if (![undefined, this.clubKey].includes(selectedClub)) {
      this.clubKey = selectedClub;
      this.getProductTransaction();
    }
  }

  public onChangeOrder(orderRefSearch: any) {
    if (![undefined, this.clubKey].includes(orderRefSearch)) {
      this.clubKey = orderRefSearch.target.value;
      this.getProductTransaction();
    }
  }

  public onChangePaymentMethod(paymentMethod: any) {
    if (![undefined, this.paymentMethod].includes(paymentMethod)) {
      this.paymentMethod = paymentMethod;
      this.getProductTransaction();
    }
  }

  public onFilterDateChange(event: any) {
    if (event.startDate && event.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getProductTransaction();
    }
  }

  public async getProductTransaction(options: Query = {}) {
    this.spinner.show();
    const { isExport = false } = options;
    options = {
      order: 'DESC',
      isFrozen: this.isFrozen,
      clubId: this.clubId,
      clubKey: this.clubKey,
      status: this.status,
      paymentMethod: this.paymentMethod,
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      page: this.page,
      limit: this.pageSize,
    };
    if (!isExport) {
      this.reportRevenueSvc.getListReportProductTransaction(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.totalRevenue = res.data.revenue;
          this.listProductTransaction = res.data.result.map((item: any) => ({
            ...item,
            paymentMethod: SystemConstant.METHOD_TYPE[item.paymentMethod]
          }));
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.limit = null;
    return this.reportRevenueSvc
      .getListReportProductTransaction(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcel() {
    const dataExport: any = await this.getProductTransaction({ isExport: true });
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-product-transaction.xlsx");
      this.spinner.hide();
    }
  }

}
