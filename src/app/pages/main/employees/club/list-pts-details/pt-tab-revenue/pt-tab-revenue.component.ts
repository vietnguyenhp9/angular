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
  selector: 'app-pt-tab-revenue',
  templateUrl: './pt-tab-revenue.component.html',
  styleUrls: ['./pt-tab-revenue.component.scss']
})
export class PtTabRevenueComponent implements OnInit {
  @Input() userId: string;
  // 
  listPtRevenueByMonth = [];
  listPtRevenueByQuarter = [];
  listMonths = [];
  listYears = [];
  listQuarters = [1, 2, 3, 4];
  month = moment().month() + 1;
  year = moment().year();
  quarter = moment().quarter();
  yearQuarter = moment().year();
  startDate: any;
  endDate: any;
  startDateQuarter: any;
  endDateQuarter: any;
  // 
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
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
    private employeeSvc: EmployeesService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.listYears = getListMonthYear().year;
    this.listMonths = getListMonthYear().month;
    this._getOptionsDate(this.type['MONTH']);
    this.getPtRevenueByMonth();
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
        this.getPtRevenueByMonth();
      },
      'quarter': () => {
        this._getOptionsDate(this.type['QUARTER']);
        this.getPtRevenueByQuarter();
      }
    };
    return _type[type]();
  }

  public onChangeMonth(month: any) {
    this.month = month;
    this._getOptionsDate(this.type['MONTH']);
    this.getPtRevenueByMonth();
  }

  public onChangeYear(year: any) {
    this.year = year;
    this._getOptionsDate(this.type['MONTH']);
    this.getPtRevenueByMonth();
  }

  public onChangeQuarter(quarter: any) {
    this.quarter = quarter;
    this._getOptionsDate(this.type['QUARTER']);
    this.getPtRevenueByQuarter();
  }

  public onChangeYearQuarter(year: any) {
    this.yearQuarter = year;
    this._getOptionsDate(this.type['QUARTER']);
    this.getPtRevenueByQuarter();
  }

  public getPtRevenueByMonth(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.page,
      limit: this.pageSizeMonth,
    };
    this.employeeSvc
      .getPtRevenueById(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.totalMonth = res.data.total;
        this.pagesMonth = getPage(this.totalMonth, this.pageSizeMonth);
        this.listPtRevenueByMonth = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  public getPtRevenueByQuarter(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDateQuarter,
      endDate: this.endDateQuarter,
      page: this.page,
      limit: this.pageSizeQuarter,
    };
    this.employeeSvc
      .getPtRevenueById(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.totalQuarter = res.data.total;
        this.pagesQuarter = getPage(this.totalQuarter, this.pageSizeQuarter);
        this.listPtRevenueByQuarter = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }
}

