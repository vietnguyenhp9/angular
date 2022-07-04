import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { getListMonthYear } from 'src/app/core/utils';
import { omitBy, isNil } from 'lodash';
import { SystemConstant } from 'src/app/core/constants/system.constant';

@Component({
  selector: 'app-gm-tab-bonus',
  templateUrl: './gm-tab-bonus.component.html',
  styleUrls: ['./gm-tab-bonus.component.scss']
})
export class GmTabBonusComponent implements OnInit {
  @Input() userId: string;
  constructor(
    private employeeSvc: EmployeesService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }
  // List
  listMonths = [];
  listYears = [];
  month = moment().month() + 1;
  year = moment().year();
  startDate: any;
  endDate: any;
  // Data
  totalBonus = 0;
  support = 0;
  revenueIncrease = 0;
  rank = 0;

  ngOnInit(): void {
    this.listMonths = getListMonthYear().month;
    this.listYears = getListMonthYear().year;
    this._getOptionDate();
    this._getPtBonus();
  }

  private _getOptionDate() {
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    this.startDate = date.startOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
    this.endDate = date.endOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
  }

  public onChangeMonth(month: any) {
    this.month = month;
    this._getOptionDate();
    this._getPtBonus();
  }

  public onChangeYear(year: any) {
    this.year = year;
    this._getOptionDate();
    this._getPtBonus();
  }

  private _getPtBonus(options?: Query) {
    this.spinner.show();
    options = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.employeeSvc
      .getGmBonusById(this.userId, omitBy(options, isNil))
      .subscribe((data: any) => {
        this.totalBonus = data.data.totalBonus;
        this.support = data.data.bonus.SUPPORT.bonusAmount;
        this.rank = data.data.bonus.RANK.bonusAmount;
        this.revenueIncrease = data.data.bonus.REVENUE_INCREASE.bonusAmount;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }
}