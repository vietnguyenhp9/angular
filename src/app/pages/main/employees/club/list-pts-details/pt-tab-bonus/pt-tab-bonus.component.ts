import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { getListMonthYear } from 'src/app/core/utils';
import { omitBy, isNil } from 'lodash';

@Component({
  selector: 'app-pt-tab-bonus',
  templateUrl: './pt-tab-bonus.component.html',
  styleUrls: ['./pt-tab-bonus.component.scss']
})
export class PtTabBonusComponent implements OnInit {
  @Input() userId: string;
  // 
  constructor(
    private employeesSvc: EmployeesService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  listMonths = [];
  listYears = [];
  month = moment().month() + 1;
  year = moment().year();
  startDate: any;
  endDate: any;
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  // 
  totalBonus = 0;
  payrollRevenue = 0;
  rank = 0;
  support = 0;
  keepRank = 0;
  // 
  listPtBonusPayrollRevenue = [];
  listPtBonusRank = [];
  listPtBonusKeepRank = [];

  ngOnInit(): void {
    this.listMonths = getListMonthYear().month;
    this.listYears = getListMonthYear().year;
    this._getPTBonusAll();
  }

  private _getOptionDate() {
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    this.startDate = date.startOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
    this.endDate = date.endOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
  }

  public onChangeMonth(month: any) {
    this.month = month;
    this._getPTBonusAll();
  }

  public onChangeYear(year: any) {
    this.year = year;
    this._getPTBonusAll();
  }

  private _getPTBonusAll() {
    this._getOptionDate();
    this._getPtBonusOverView();
    this._getListPtBonusPayroll();
    this._getListPtBonusRank();
    this._getListPtBonusKeepRank();
  }

  private _getPtBonusOverView(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeesSvc.getPtBonusOverview(this.userId, omitBy(options, isNil)).subscribe((res: any) => {
      this.totalBonus = res.data.revenue;
      this.payrollRevenue = res.data.income.PAYROLL_REVENUE;
      this.rank = res.data.income.RANK;
      this.support = res.data.income.SUPPORT;
      this.keepRank = res.data.income.KEEP_RANK;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private _getListPtBonusPayroll() {
    this.spinner.show();
    const options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeesSvc.getPtPayrollContract(this.userId, options).subscribe((res: any) => {
      this.listPtBonusPayrollRevenue = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  };

  private _getListPtBonusRank() {
    this.spinner.show();
    const options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeesSvc.getPtBonusRank(this.userId, options).subscribe((res: any) => {
      this.listPtBonusPayrollRevenue = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  };

  private _getListPtBonusKeepRank() {
    this.spinner.show();
    const options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeesSvc.getPtBonusKeepRank(this.userId, options).subscribe((res: any) => {
      this.listPtBonusKeepRank = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  };

}

