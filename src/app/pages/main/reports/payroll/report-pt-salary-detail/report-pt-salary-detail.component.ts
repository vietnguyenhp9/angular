import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty, isNil, omitBy } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ReportPayrollService } from 'src/app/core/services/reports/report-payroll.service';
import { getListMonthYear, getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-report-pt-salary-detail',
  templateUrl: './report-pt-salary-detail.component.html',
  styleUrls: ['./report-pt-salary-detail.component.scss']
})
export class ReportPtSalaryDetailComponent implements OnInit {

  // Pagination
  pageRevenue = SystemConstant.PAGING.PAGES;
  pageBonus = SystemConstant.PAGING.PAGES;
  pageSizeBonus = SystemConstant.PAGING.PAGESIZE;
  pageSizeRevenue = SystemConstant.PAGING.PAGESIZE;
  pagesRevenue = 0;
  pagesBonus = 0;
  // List
  listMonths = getListMonthYear().month;
  listYears = getListMonthYear().year;
  listDetailPtRevenue = [];
  listDetailPtBonus = [];
  // Data
  ptId: string;
  ptName: string;
  rankSalary: number;
  keepRankSalary: number;
  supportSalary: number;
  totalRevenue: number;
  totalBonus: number;
  totalRevenueAmount: number;
  totalBonusAmount: number;
  // Data PT Salary
  bonusRankAmount: number;
  bonusRankPercentage: number;
  bonusRankRevenue: number;
  bonusKeepRankAmount: number;
  bonusKeepRankPercentage: number;
  bonusKeepRankRevenue: number;
  bonusSupportAmount: number;
  // FIlter
  selectedMonth: number;
  selectedYear: number;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  startDate: moment.Moment;
  endDate: moment.Moment;
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  constructor(
    private reportPayrollSvc: ReportPayrollService,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getQueryParams();
    this.getListPtDetail();
  }

  public changePageSize(type: string) {
    const _type = {
      revenue: () => this.getDetailPtRevenue(+this.ptId),
      bonus: () => this.getDetailPtBonus(+this.ptId),
    };
    _type[type]();
  }

  public getListPtDetail() {
    this.getDetailPtRevenue(+this.ptId);
    this.getDetailPtBonus(+this.ptId);
    this.getDetailPtBonusRank(+this.ptId);
    this.getDetailPtBonusKeepRank(+this.ptId);
    this.getDetailPtBonusSupport(+this.ptId);
  }

  private getQueryParams() {
    this.ptId = this.route.snapshot.paramMap.get('id');
    this.ptName = sessionStorage.getItem('ptName');
    this.route.queryParams.subscribe((params) => {
      if (isEmpty(params)) {
        this.month = new Date().getMonth() + 1;
        this.year = new Date().getFullYear();
        this.router.navigate([`/reports/payroll/pt-detail/${this.ptId}`], {
          queryParams: {
            month: this.month,
            year: this.year,
          },
        });
        return;
      }
      this.month = params.month;
      this.year = params.year;
      this.selectedMonth = params.month;
      this.selectedYear = params.year;
    });
  }

  private getOptionsData(type?: string): object {
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    const _type = {
      revenue: {
        limit: this.pageSizeRevenue,
        page: this.pageRevenue,
      },
      bonus: {
        limit: this.pageSizeBonus,
        page: this.pageBonus,
      },
    };
    const options = {
      limit: _type[type]?.limit,
      page: _type[type]?.page,
      startDate: date.startOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT),
      endDate: date.endOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT),
    };
    return omitBy(options, isNil);
  }

  public loadNextRevenue(page: number) {
    this.pageRevenue = page;
    this.getDetailPtRevenue(+this.ptId);
  }

  public loadNextBonus(page: number) {
    this.pageBonus = page;
    this.getDetailPtBonus(+this.ptId);
  }

  public onChangeMonth(month: number) {
    if (![undefined, this.month].includes(month)) {
      this.month = month;
      this.pageRevenue = 1;
      this.pageBonus = 1;
      this.getListPtDetail();
      this.router.navigate([`reports/payroll/pt-detail/${this.ptId}`], {
        queryParams: {
          month: this.month,
          year: this.year,
        },
      });
    }
  }

  public onChangeYear(year: number) {
    if (![undefined, this.year].includes(year)) {
      this.year = year;
      this.pageRevenue = 1;
      this.pageBonus = 1;
      this.getListPtDetail();
      this.router.navigate([`reports/payroll/pt-detail/${this.ptId}`], {
        queryParams: {
          month: this.month,
          year: this.year,
        },
      });
    }
  }

  public getDetailPtRevenue(ptId: number) {
    this.spinner.show();
    const options = this.getOptionsData('revenue');
    this.reportPayrollSvc.getDetailPtRevenue(ptId, options).subscribe((res: any) => {
      this.totalRevenue = res.data.total;
      this.pagesRevenue = getPage(this.totalRevenue, this.pageSizeRevenue);
      this.totalRevenueAmount = res.data.totalAmount;
      this.listDetailPtRevenue = res.data.result.map((item: any) => ({
        ...item
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public getDetailPtBonus(ptId: number) {
    this.spinner.show();
    const options = this.getOptionsData('bonus');
    this.reportPayrollSvc.getDetailPtBonus(ptId, options).subscribe((res: any) => {
      this.totalBonus = res.data.total;
      this.pagesBonus = getPage(this.totalBonus, this.pageSizeBonus);
      this.totalBonusAmount = res.data.totalAmount;
      this.listDetailPtBonus = res.data.result.map((item: any) => ({
        ...item
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public getDetailPtBonusRank(ptId: number) {
    const options = this.getOptionsData();
    this.reportPayrollSvc.getDetailPtBonusRank(ptId, options).subscribe((res: any) => {
      this.bonusRankAmount = res.data.bonusAmount;
      this.bonusRankPercentage = res.data.bonusPercentage;
      this.bonusRankRevenue = res.data.revenue;

    });
  }

  public getDetailPtBonusKeepRank(ptId: number) {
    const options = this.getOptionsData();
    this.reportPayrollSvc
      .getDetailPtBonusKeepRank(ptId, options)
      .subscribe((res: any) => {
        this.bonusKeepRankAmount = res.data.bonusAmount;
        this.bonusKeepRankPercentage = res.data.bonusPercentage;
        this.bonusKeepRankRevenue = res.data.revenue;
      });
  }

  getDetailPtBonusSupport(ptId: number) {
    const options = this.getOptionsData();
    this.reportPayrollSvc
      .getDetailPtBonusSupport(ptId, options)
      .subscribe((res: any) => {
        this.bonusSupportAmount = res.data.bonusAmount;
      });
  }

}
