import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentPlan } from 'src/app/core/models/share/payment-plan.model';
import { Query } from 'src/app/core/models/share/query.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ReportRevenueService } from 'src/app/core/services/reports/report-revenue.service';
import { exportExcel, getDataSelect, getPage } from 'src/app/core/utils';
@Component({
  selector: 'app-report-member-contract',
  templateUrl: './report-member-contract.component.html',
  styleUrls: ['./report-member-contract.component.scss']
})
export class ReportMemberContractComponent implements OnInit {
  @Input() hyperLinkMemberRevenue: any;
  @Input() listClub: Club[];
  @Input() userInfo: UserProfile;
  listPaymentPlan: PaymentPlan[];
  listMemberContract = [];
  listStatus = [
    SystemConstant.STATUS.CURRENT,
    SystemConstant.STATUS.FUTURE,
    SystemConstant.STATUS.PAST
  ];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Filter
  selectedClub: number;
  selectedPaymentPlan: number;
  selectedStatus: string;
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
  status: string = null;
  isFrozen = false;
  clubId: number;
  paymentPlanId: number;

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
    this._getListActivePaymentPlanForSelect();
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getMemberContract();
  }

  private async _getListActivePaymentPlanForSelect(options?: Query) {
    options = {
      isActive: 1,
      isAll: true,
      clubId: this.clubId
    }
    this.listPaymentPlan = await getDataSelect(this.reportRevenueSvc.getListActivePaymentMethod(omitBy(options, isNil)));
  }

  public async onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.selectedPaymentPlan = this.paymentPlanId = null;
      this.clubId = selectedClub;
      this.page = 1;
      this._getListActivePaymentPlanForSelect();
      this.getMemberContract();
    }
  }

  public onChangePaymentPlan(selectedPaymentPlan: number) {
    if (![undefined, this.paymentPlanId].includes(selectedPaymentPlan)) {
      this.paymentPlanId = selectedPaymentPlan;
      this.page = 1;
      this.getMemberContract();
    }
  }

  public onChangeStatus() {
    this.status = this.selectedStatus;
    this.page = 1;
    this.getMemberContract();
  }

  public onChangePage(page: number) {
    if (page && this.page !== page) {
      this.page = page;
      this.getMemberContract();
    }
  }

  public onCheckFrozen() {
    this.page = 1;
    this.getMemberContract();
  }

  public onFilterDateChange(event: any) {
    if (event.startDate && event.endDate) {
      this.page = 1;
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getMemberContract();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getMemberContract();
  }

  public async getMemberContract(options: Query = {}) {
    this.spinner.show();
    const { isExport = false } = options;
    options = {
      order: 'DESC',
      isFrozen: this.isFrozen,
      clubId: this.clubId,
      paymentPlanId: this.paymentPlanId,
      status: this.status,
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
      this.reportRevenueSvc.getListReportMemberContract(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.listMemberContract = res.data.result.map((item: any) => ({
            ...item,
            isFrozen: item.isFrozen === 0
              ? this.translate.instant('DATA.REPORTS.NO')
              : this.translate.instant('DATA.REPORTS.YES')
          }));
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.limit = null;
    return this.reportRevenueSvc
      .getListReportMemberContract(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcel() {
    const dataExport: any = await this.getMemberContract({ isExport: true });
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-member-contract.xlsx");
      this.spinner.hide();
    }
  }

  public forceSync() {
    this.reportRevenueSvc.forceSync().subscribe((res: any) => {
      if (res) {
        this.alert.success(this.translate.instant('FORM.SYNC_SUCCESS'));
        return;
      }
      this.alert.error(this.translate.instant('FORM.SYNC_FAIL'));
    });
  }
}
