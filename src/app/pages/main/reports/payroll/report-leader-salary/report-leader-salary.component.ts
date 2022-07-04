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
  selector: 'app-report-leader-salary',
  templateUrl: './report-leader-salary.component.html',
  styleUrls: ['./report-leader-salary.component.scss']
})
export class ReportLeaderSalaryComponent implements OnInit {
  @Input() hyperLinkMemberPayroll: any;
  // Select box
  @Input() listClub: Club[];
  @Input() listMonth: any;
  @Input() listYear: any;
  @Input() userInfo: UserProfile;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // List
  listLeaderSalary = [];
  listLeader = [];
  // Data
  totalBonus: number;
  totalRevenue: number;
  // Query
  selectedPtLeader: number;
  selectedClub: number;
  selectedMonth = moment().get('month') + 1;
  selectedYear = moment().get('year');
  isDisableSelected: boolean;
  leaderId: number;
  clubId: number;
  startDate: string;
  endDate: string;
  isExport = false;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  // Sort
  objSort: any = {};
  checkedRevAsc = false;
  checkedRevDesc = false;
  checkedBonusAsc = false;
  checkedBonusDesc = false;

  constructor(
    private reportPayrollSvc: ReportPayrollService,
    public translate: TranslateService,
    private shareSvc: ShareService,
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
      this.getListPtLeaderSelect(this.selectedClub);
    }
    this.getListLeaderSalary();
  }

  private async getListPtLeaderSelect(options: any) {
    options = {
      clubId: this.clubId,
      limit: 100
    };
    this.listLeader = await getDataSelect(this.shareSvc.getListPtLeaderByClub(omitBy(options, isNil)));
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListLeaderSalary();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.leaderId = this.selectedPtLeader = null;
      this.listLeader = [];
      if (selectedClub !== null) {
        this.getListPtLeaderSelect(this.clubId);
      }
      this.getListLeaderSalary();
    }
  }

  public onChangeMonth(month: number) {
    if (![undefined, this.month].includes(month)) {
      this.month = month;
      this.page = 1;
      this.getListLeaderSalary();
    }
  }

  public onChangeYear(year: number) {
    if (![undefined, this.year].includes(year)) {
      this.year = year;
      this.page = 1;
      this.getListLeaderSalary();
    }
  }

  public onChangePt(selectedPtLeader: number) {
    if (![undefined, this.leaderId].includes(selectedPtLeader)) {
      this.leaderId = selectedPtLeader;
      this.page = 1;
      this.getListLeaderSalary();
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
    this.getListLeaderSalary();
  }

  public async getListLeaderSalary(options: Query = {}) {
    this.spinner.show();
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    options = {
      leaderId: this.leaderId,
      clubId: this.clubId,
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
        .getListLeaderReportSalary(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.listLeaderSalary = res.data.result.map((response: any) => ({
            ...response,
            salary: response.bonus
          }));
          this.totalBonus = res.data.totalBonus;
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
      .getListLeaderReportSalary(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcelLeaderSalary() {
    this.isExport = true;
    const dataExport: any = await this.getListLeaderSalary();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-leader-salary.xlsx");
      this.spinner.hide();
    }
  }
}
