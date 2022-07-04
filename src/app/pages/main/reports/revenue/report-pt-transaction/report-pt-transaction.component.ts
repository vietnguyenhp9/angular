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
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-pt-transaction',
  templateUrl: './report-pt-transaction.component.html',
  styleUrls: ['./report-pt-transaction.component.scss']
})
export class ReportPtTransactionComponent implements OnInit {
  @Input() hyperLinkMemberRevenue: any;
  // Select data
  @Input() listClub: Club[];
  @Input() listPaymentMethod: PaymentMethod[];
  @Input() userInfo: UserProfile;
  // List
  listPtTransaction = [];
  totalRevenue = 0;
  // Format
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Filter
  selectedClub: string;
  selectedPaymentMethod: number;
  orderRefSearch: string;
  selectedDateTime: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  selectedType = 'day';
  selectedTransactionType: string;
  isDisableSelected: boolean;
  nameColumn: any;
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
  clubKey: string;
  paymentMethod: string;
  transactionType: string;

  constructor(
    private reportRevenueSvc: ReportRevenueService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
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
      this.clubKey = this.userInfo.clubKey;
      this.selectedClub = this.userInfo.clubKey;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getPtTransaction();
  }

  public onChangeClub(selectedClub: string) {
    if (![undefined, this.clubKey].includes(selectedClub)) {
      this.clubKey = selectedClub;
      this.getPtTransaction();
    }
  }

  public onChangeOrder(orderRefSearch: any) {
    if (![undefined, this.clubKey].includes(orderRefSearch)) {
      this.clubKey = orderRefSearch.target.value;
      this.getPtTransaction();
    }
  }

  public onChangePaymentMethod(paymentMethod: any) {
    if (![undefined, this.paymentMethod].includes(paymentMethod)) {
      this.paymentMethod = paymentMethod;
      this.getPtTransaction();
    }
  }

  public onChangeTransactionType(selectedTransactionType: string) {
    this.transactionType = selectedTransactionType;
    this.getPtTransaction();
  }

  public onChangePage(page: number) {
    if (page) {
      this.page = page;
      this.getPtTransaction();
    }
  }

  public onFilterDateChange(event: any) {
    if (event.startDate && event.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getPtTransaction();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getPtTransaction();
  }

  public async getPtTransaction(options: Query = {}) {
    this.spinner.show();
    const { isExport = false } = options;
    options = {
      order: 'DESC',
      isFrozen: this.isFrozen,
      clubKey: this.clubKey,
      status: this.status,
      paymentMethod: this.paymentMethod,
      transactionType: this.transactionType,
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      page: this.page,
      limit: this.pageSize
    };
    if (!isExport) {
      this.reportRevenueSvc.getListReportPtTransaction(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.listPtTransaction = res.data.result.map((item: any) => ({
            ...item,
            paymentMethod: SystemConstant.METHOD_TYPE[item.paymentMethod],
            couponCodeId: isEmpty(item.couponCodeId) ? "-" : item.couponCodeId,
            sellerName: isEmpty(item.sellerName) ? "-" : item.sellerName
          }));
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.totalRevenue = res.data.revenue;
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.limit = null;
    return this.reportRevenueSvc
      .getListReportPtTransaction(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcel() {
    const dataExport: any = await this.getPtTransaction({ isExport: true });
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-pt-transaction.xlsx");
      this.spinner.hide();
    }
  }

  public forceSync() {
    return this.reportRevenueSvc.forceSync().subscribe((res: any) => {
      if (res) {
        this.alert.success(this.translate.instant('FORM.SYNC_SUCCESS'));
        return;
      }
      this.alert.error(this.translate.instant('FORM.SYNC_FAIL'));
    });
  }
}
