import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ReportRevenueService } from 'src/app/core/services/reports/report-revenue.service';
import { exportExcel, getPage } from 'src/app/core/utils';
import { PaymentMethod } from 'src/app/core/models/share/payment-method.model';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-member-transaction',
  templateUrl: './report-member-transaction.component.html',
  styleUrls: ['./report-member-transaction.component.scss']
})
export class ReportMemberTransactionComponent implements OnInit {
  @Input() hyperLinkMemberRevenue: any;
  // Select data
  @Input() listClub: Club[];
  @Input() listPaymentMethod: PaymentMethod[];
  @Input() userInfo: UserProfile;
  // List
  listMemberTransaction = [];
  totalRevenue = 0;
  // Format
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Filter
  selectedClub: string;
  selectedPaymentMethod: string;
  selectedStatus: string;
  selectedDateTime: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  orderRefSearch: string;
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
  status = '';
  isFrozen = false;
  clubKey: string;
  paymentMethod: string;

  constructor(
    private reportRevenueSvc: ReportRevenueService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    public translate: TranslateService
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
    this.getMemberTransaction();
  }

  public onChangeOrder(orderRefSearch: any) {
    if (![undefined, this.clubKey].includes(orderRefSearch)) {
      this.clubKey = orderRefSearch.target.value;
      this.getMemberTransaction();
    }
  }

  public onChangeClub(selectedClub: string) {
    if (![undefined, this.clubKey].includes(selectedClub)) {
      this.clubKey = selectedClub;
      this.getMemberTransaction();
    }
  }

  public onChangePaymentMethod(selectedPaymentMethod: any) {
    if (![undefined, this.paymentMethod].includes(selectedPaymentMethod)) {
      this.paymentMethod = selectedPaymentMethod;
      this.getMemberTransaction();
    }
  }

  public onFilterDateChange(event: any) {
    if (event.startDate && event.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getMemberTransaction();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getMemberTransaction();
  }

  // Get list memeber transaction
  public async getMemberTransaction(options: Query = {}) {
    this.spinner.show();
    const { isExport = false } = options;
    options = {
      clubKey: this.clubKey,
      paymentMethod: this.paymentMethod,
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      order: 'DESC',
      page: this.page,
      limit: this.pageSize
    };
    if (!isExport) {
      this.reportRevenueSvc.getListReportMemberTransaction(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.totalRevenue = res.data.revenue;
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.listMemberTransaction = res.data.result.map((item: any) => ({
            ...item,
            paymentMethod: SystemConstant.METHOD_TYPE[item.paymentMethod],
            couponCodeId: isEmpty(item.couponCodeId) ? "-" : item.couponCodeId,
            sellerName: isEmpty(item.sellerName) ? "-" : item.sellerName
          }));
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.limit = null;
    return this.reportRevenueSvc
      .getListReportMemberTransaction(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcel() {
    const dataExport: any = await this.getMemberTransaction({ isExport: true });
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-member-transaction.xlsx");
      this.spinner.hide();
    };
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
