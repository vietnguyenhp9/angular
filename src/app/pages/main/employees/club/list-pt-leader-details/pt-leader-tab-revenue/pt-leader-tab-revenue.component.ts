import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { getListMonthYear, getPage } from 'src/app/core/utils';
import { omitBy, isNil } from 'lodash';


@Component({
  selector: 'app-pt-leader-tab-revenue',
  templateUrl: './pt-leader-tab-revenue.component.html',
  styleUrls: ['./pt-leader-tab-revenue.component.scss']
})
export class PtLeaderTabRevenueComponent implements OnInit {
  @Input() userId: string;
  // List
  listPtRevenueByMonth = [];
  listPtRevenueByQuarter = [];
  listMonths = [];
  listYears = [];
  listQuaters = [1, 2, 3, 4];
  // Filter
  month = moment().month() + 1;
  year = moment().year();
  quarter = moment().quarter();
  yearQuarter = moment().year();
  startDate: any;
  endDate: any;
  startDateQuarter: any;
  endDateQuarter: any;
  // Data
  totalRevenueMonthly = 0;
  totalRevenueQuarter = 0;
  // Pagination
  totalMonth: number;
  pagesMonth: number;
  page = SystemConstant.PAGING.PAGES;
  pageSizeMonth = SystemConstant.PAGING.PAGESIZE;
  // --
  totalQuarter: number;
  pagesQuarter: number;
  pageSizeQuarter = SystemConstant.PAGING.PAGESIZE;
  // 
  type = {
    MONTH: 'month',
    QUARTER: 'quarter'
  };

  constructor(
    private spinner: NgxSpinnerService,
    private employeeSvc: EmployeesService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.listYears = getListMonthYear().year;
    this.listMonths = getListMonthYear().month;
    this._getOptionsDate(this.type['MONTH']);
    this.getPtLeaderRevenueByMonth();
  }

  private _getOptionsDate(type: string) {
    const _type = {
      'month': () => {
        const date = moment({ year: this.year, month: this.month - 1, day: 1 });
        this.startDate = date.startOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
        this.endDate = date.endOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
      },
      'quarter': () => {
        const dateQuarter = moment({ year: this.yearQuarter, month: 1, day: 1 });
        this.startDateQuarter = dateQuarter
          .quarter(this.quarter)
          .startOf('quarter')
          .format(SystemConstant.TIME_FORMAT.DEFAULT);
        this.endDateQuarter = dateQuarter
          .quarter(this.quarter)
          .endOf('quarter')
          .format(SystemConstant.TIME_FORMAT.DEFAULT);
      }
    };
    return _type[type]();
  }

  public loadNext(page: number, type: string) {
    this.page = page;
    const _type = {
      'month': () => {
        this._getOptionsDate(this.type['MONTH']);
        this.getPtLeaderRevenueByMonth();
      },
      'quarter': () => {
        this._getOptionsDate(this.type['QUARTER']);
        this.getPtLeaderRevenueByQuarter();
      }
    };
    return _type[type]();
  }

  public onChangeMonth(month: any) {
    this.month = month;
    this._getOptionsDate(this.type['MONTH']);

    this.getPtLeaderRevenueByMonth();
  }

  public onChangeYear(year: any) {
    this.year = year;
    this._getOptionsDate(this.type['MONTH']);
    this.getPtLeaderRevenueByMonth();
  }

  public onChangeQuarter(quarter: any) {
    this.quarter = quarter;
    this._getOptionsDate(this.type['QUARTER']);
    this.getPtLeaderRevenueByQuarter();
  }

  public onChangeYearQuarter(year: any) {
    this.yearQuarter = year;
    this._getOptionsDate(this.type['QUARTER']);
    this.getPtLeaderRevenueByQuarter();
  }

  public getPtLeaderRevenueByMonth(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.page,
      limit: this.pageSizeMonth,
    };
    this.employeeSvc
      .getPtLeaderRevenueById(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.totalMonth = res.data.total;
        this.pagesMonth = getPage(this.totalMonth, this.pageSizeMonth);
        this.totalRevenueMonthly = res.data.revenue;
        this.listPtRevenueByMonth = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  public getPtLeaderRevenueByQuarter(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDateQuarter,
      endDate: this.endDateQuarter,
      page: this.page,
      limit: this.pageSizeQuarter,
    };
    this.employeeSvc
      .getPtLeaderRevenueById(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.totalQuarter = res.data.total;
        this.pagesQuarter = getPage(this.totalQuarter, this.pageSizeQuarter);
        this.totalRevenueMonthly = res.data.revenue;
        this.listPtRevenueByMonth = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }
}
