import { Component, Input, OnInit } from '@angular/core';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { getListMonthYear } from 'src/app/core/utils';
import { omitBy, isNil } from 'lodash';


@Component({
  selector: 'app-pt-leader-tab-bonus',
  templateUrl: './pt-leader-tab-bonus.component.html',
  styleUrls: ['./pt-leader-tab-bonus.component.scss']
})
export class PtLeaderTabBonusComponent implements OnInit {
  @Input() userId: string;
  // 
  listMonths = [];
  listYears = [];
  month = moment().month() + 1;
  year = moment().year();
  totalRevenue = 0;
  startDate: any;
  endDate: any;
  ptLeaderId: number;
  prePayment = 0;
  quarterSumary = 0;
  training = 0;
  monthIncrease = 0;
  quarterIncrease = 0;
  yearIncrease = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private employeeSvc: EmployeesService
  ) { }

  ngOnInit(): void {
    this.listMonths = getListMonthYear().month;
    this.listYears = getListMonthYear().year;
    this._getOptionDate();
    this._getPtLeaderBonusByMonth();
    this._getPtLeaderBonus();
  }

  private _getOptionDate() {
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    this.startDate = date.startOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
    this.endDate = date.endOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
  }

  public onChangeMonth(month: any) {
    this.month = month;
    this._getOptionDate();
    this._getPtLeaderBonusByMonth();
    this._getPtLeaderBonus();
  }

  public onChangeYear(year: any) {
    this.year = year;
    this._getOptionDate();
    this._getPtLeaderBonusByMonth();
    this._getPtLeaderBonus();
  }

  private _getPtLeaderBonusByMonth(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeeSvc
      .getPtLeaderBonusByIdByMonth(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.totalRevenue = res.data.totalRevenue;
        this.prePayment = res.data.income.PRE_PAYMENT;
        this.quarterSumary = res.data.income.QUARTER_SUMARY;
        this.training = res.data.income.TRAINING;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  private _getPtLeaderBonus(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeeSvc
      .getPtLeaderBonusByIdByMonth(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.monthIncrease = res.data.income.MONTH_INCREASE;
        this.quarterIncrease = res.data.income.QUARTER_INCREASE;
        this.yearIncrease = res.data.income.YEAR_INCREASE;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }
}
