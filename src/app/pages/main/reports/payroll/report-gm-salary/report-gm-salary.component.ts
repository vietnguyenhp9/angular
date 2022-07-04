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
import { exportExcel, getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-report-gm-salary',
  templateUrl: './report-gm-salary.component.html',
  styleUrls: ['./report-gm-salary.component.scss']
})
export class ReportGmSalaryComponent implements OnInit {
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
  // Query
  clubId: number;
  ptGroupId: number;
  selectedClub: number;
  selectedMonth = moment().get('month') + 1;
  selectedYear = moment().get('year');
  isDisableSelected: boolean;
  startDate: string;
  endDate: string;
  isExport = false;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  // List
  listGmSalary = [];
  // Data
  totalRevenue: number;
  totalBonus: number;
  // Sort
  objSort: any = {};
  checkedRevAsc = false;
  checkedRevDesc = false;
  checkedBonusAsc = false;
  checkedBonusDesc = false;

  constructor(
    private reportPayrollSvc: ReportPayrollService,
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
    }
    this.getListGmSalary();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListGmSalary();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.getListGmSalary();
    }
  }

  public onChangeMonth(month: number) {
    if (![undefined, this.month].includes(month)) {
      this.month = month;
      this.page = 1;
      this.getListGmSalary();
    }
  }

  public onChangeYear(year: number) {
    if (![undefined, this.year].includes(year)) {
      this.year = year;
      this.page = 1;
      this.getListGmSalary();
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
    this.getListGmSalary();
  }

  public async getListGmSalary(options: Query = {}) {
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
      this.reportPayrollSvc.getListGmSalaryReport(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.listGmSalary = res.data.result.map((response: any) => ({
            ...response,
            salary: response.bonus
          }));
          this.totalRevenue = res.data.totalRevenue;
          this.totalBonus = res.data.totalBonus;
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.isExport = this.isExport;
    this.isExport = false;
    return this.reportPayrollSvc
      .getListGmSalaryReport(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcelGMSalary() {
    this.isExport = true;
    const dataExport: any = await this.getListGmSalary();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-gm-salary.xlsx");
      this.spinner.hide();
    }
  }
}
