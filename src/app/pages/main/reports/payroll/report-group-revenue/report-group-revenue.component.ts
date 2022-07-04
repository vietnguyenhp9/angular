import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ReportPayrollService } from 'src/app/core/services/reports/report-payroll.service';
import { omitBy, isNil } from 'lodash';
import { exportExcel, getDataSelect, getPage } from 'src/app/core/utils';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-report-group-revenue',
  templateUrl: './report-group-revenue.component.html',
  styleUrls: ['./report-group-revenue.component.scss']
})
export class ReportGroupRevenueComponent implements OnInit {
  // Select box
  @Input() listClub: Club[];
  @Input() listMonth = [];
  @Input() listYear = [];
  @Input() userInfo: UserProfile;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // List 
  listGroupRevenue = [];
  listGroup = [];
  // Data
  totalBonus: number;
  totalRevenue: number;
  // Query
  clubId: number;
  ptGroupId: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  isExport = false;
  // FIlter
  selectedGroup: number;
  selectedClub: number;
  selectedMonth = moment().get('month') + 1;
  selectedYear = moment().get('year');
  isDisableSelected: boolean;
  // Sort
  objSort: any = {};
  checkedRevAsc = false;
  checkedRevDesc = false;
  checkedBonusAsc = false;
  checkedBonusDesc = false;

  constructor(
    private reportPayrollSvc: ReportPayrollService,
    private shareSvc: ShareService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
      this.getListGroupSelect(this.selectedClub);
    }
    this.getListGroupRevenue();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListGroupRevenue();
  }

  private async getListGroupSelect(clubId: number) {
    this.listGroup = await getDataSelect(this.shareSvc.getListGroupByClub(clubId));
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.ptGroupId = this.selectedGroup = null;
      this.listGroup = [];
      if (selectedClub !== null) {
        this.getListGroupSelect(selectedClub);
      }
      this.getListGroupRevenue();
    }
  }

  public onChangeGroup(selectedGroup: number) {
    if (![undefined, this.ptGroupId].includes(selectedGroup)) {
      this.ptGroupId = selectedGroup;
      this.getListGroupRevenue();
    }
  }

  public onChangeMonth(month: number) {
    if (![undefined, this.month].includes(month)) {
      this.month = month;
      this.page = 1;
      this.getListGroupRevenue();
    }
  }

  public onChangeYear(year: number) {
    if (![undefined, this.year].includes(year)) {
      this.year = year;
      this.page = 1;
      this.getListGroupRevenue();
    }
  }

  // Delete Key Sort 
  public deleteKeySort(key) {
    delete this.objSort[key];
  }

  // Add Key Sort
  public addKeySort(key, type) {
    if (!key || !type) {
      return;
    }
    this.objSort = Object.assign(this.objSort, {
      [key]: type,
    });
  }

  // Sort Revenue And Salary
  public sortData(keySort: string) {
    const [key, type] = (keySort || '').split("_");
    const checkSort = {
      revenue_asc: () => {
        this.checkedRevAsc = !this.checkedRevAsc;
        this.checkedRevDesc = this.checkedRevAsc && false;
        !this.checkedRevAsc
          ? this.deleteKeySort('revenue')
          : this.addKeySort(key, type);
      },
      revenue_desc: () => {
        this.checkedRevDesc = !this.checkedRevDesc;
        this.checkedRevAsc = this.checkedRevAsc && false;
        !this.checkedRevDesc
          ? this.deleteKeySort('revenue')
          : this.addKeySort(key, type);
      },
      bonus_asc: () => {
        this.checkedBonusAsc = !this.checkedBonusAsc;
        this.checkedBonusDesc = this.checkedBonusAsc && false;
        !this.checkedBonusAsc
          ? this.deleteKeySort('bonus')
          : this.addKeySort(key, type);
      },
      bonus_desc: () => {
        this.checkedBonusDesc = !this.checkedBonusDesc;
        this.checkedBonusAsc = this.checkedBonusDesc && false;
        !this.checkedBonusDesc
          ? this.deleteKeySort('bonus')
          : this.addKeySort(key, type);
      },
    };
    checkSort[keySort]();
    this.page = 1;
    this.getListGroupRevenue();
  }

  public async getListGroupRevenue(options: Query = {}) {
    this.spinner.show();
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    options = {
      clubId: this.clubId,
      ptGroupId: this.ptGroupId,
      startDate: date.startOf('month').format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: date.endOf('month').format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      orderKey: Object.keys(this.objSort).join(',') || null,
      orderType: Object.values(this.objSort).join(',') || null,
      page: this.page,
      limit: this.pageSize,
    };
    if (!this.isExport) {
      this.reportPayrollSvc
        .getListGroupRevenueReport(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.listGroupRevenue = res.data.result.map((response: any) => ({
            ...response,
            salary: response.bonus
          }));
          this.totalRevenue = res.data.totalRevenue;
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.isExport = this.isExport;
    this.isExport = false;
    return this.reportPayrollSvc
      .getListGroupRevenueReport(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcelGroupSalary() {
    this.isExport = true;
    const dataExport: any = await this.getListGroupRevenue();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-group-revenue.xlsx");
      this.spinner.hide();
    }
  }
}
