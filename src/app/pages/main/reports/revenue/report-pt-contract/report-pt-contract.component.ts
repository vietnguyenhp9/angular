import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { ReportRevenueService } from 'src/app/core/services/reports/report-revenue.service';
import { isNil, omitBy } from 'lodash';
import { exportExcel, getPage } from 'src/app/core/utils';
import { Club } from 'src/app/core/models/share/club.model';
import { PtPackage } from 'src/app/core/models/share/pt-package.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-pt-contract',
  templateUrl: './report-pt-contract.component.html',
  styleUrls: ['./report-pt-contract.component.scss']
})
export class ReportPtContractComponent implements OnInit {
  @Input() hyperLinkMemberRevenue: any;
  // Select data
  @Input() listClub: Club[];
  @Input() listPackage: PtPackage[];
  @Input() userInfo: UserProfile;
  listStatus = [
    { id: SystemConstant.STATUS.CURRENT, text: SystemConstant.STATUS.CURRENT },
    { id: SystemConstant.STATUS.FUTURE, text: SystemConstant.STATUS.FUTURE },
    { id: SystemConstant.STATUS.PAST, text: SystemConstant.STATUS.PAST },
  ];
  // List
  listPtContract = [];
  // Format
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Filter
  selectedClub: number;
  selectedPtPkg: number;
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
  status: string;
  isFrozen = false;
  clubId: number;
  ptPackageId: number;

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
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getPtContract();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.getPtContract();
    }
  }

  public onChangeStatus() {
    this.status = this.selectedStatus;
    this.getPtContract();
  }

  onChangePtPkg(selectedPtPkg: any) {
    if (![undefined, this.ptPackageId].includes(selectedPtPkg)) {
      this.ptPackageId = selectedPtPkg;
      this.getPtContract();
    }
  }

  public onChangePage(page: number) {
    if (page) {
      this.page = page;
      this.getPtContract();
    }
  }

  public onCheckFrozen() {
    this.getPtContract();
  }

  public onFilterDateChange(event: any) {
    if (event.startDate && event.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getPtContract();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getPtContract();
  }

  public async getPtContract(options: Query = {}) {
    this.spinner.show();
    const { isExport = false } = options;
    options = {
      order: 'DESC',
      isFrozen: this.isFrozen,
      clubId: this.clubId,
      ptPackageId: this.ptPackageId,
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
      this.reportRevenueSvc.getListReportPtContract(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.listPtContract = res.data.result.map((item: any) => {
            return {
              ...item,
              isFrozen: item.isFrozen === 0
                ? this.translate.instant('DATA.REPORTS.FROZEN_FALSE')
                : this.translate.instant('DATA.REPORTS.FROZEN_TRUE'),
            };
          });
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.limit = null;
    return this.reportRevenueSvc
      .getListReportPtContract(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcel() {
    const dataExport: any = await this.getPtContract({ isExport: true });
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-pt-contract.xlsx");
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
