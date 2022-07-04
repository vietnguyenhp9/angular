import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import { isNil, omitBy } from 'lodash';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { LanguageService } from 'src/app/core/services/common/language.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-chart-total-revenue',
  templateUrl: './chart-total-revenue.component.html',
  styleUrls: ['./chart-total-revenue.component.scss']
})
export class ChartTotalRevenueComponent implements OnInit {
  @Input() listClub: Club[];
  @Input() userInfo: any;
  // Filter
  clubKey: string;
  type = '' || 'day';
  startDate: string;
  endDate: string;
  // 
  selectedType = 'day';
  selectedClub: string;
  isDisableSelected: boolean;
  // HighChart
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = true;
  totalRevenueChart: Highcharts.Options;

  constructor(
    private dashBoardSvc: DashboardService,
    private spinner: NgxSpinnerService,
    public languageSvc: LanguageService,
    public translate: TranslateService,
    public shareSvc: ShareService,
  ) {
    this.startDate = moment().startOf('day').format(SystemConstant.TIME_FORMAT.DEFAULT);
    this.endDate = moment().endOf('day').format(SystemConstant.TIME_FORMAT.DEFAULT);
  }
  ngOnInit(): void {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubKey = this.userInfo.clubKey;
      this.selectedClub = this.userInfo.clubKey;
      this.isDisableSelected = true;
    }
    this._getDataPaymentPlan();
  }

  public onChangeClub() {
    this.clubKey = this.selectedClub;
    this._getDataPaymentPlan();
  }

  public onChangeType() {
    const typeTime = {
      'day': () => {
        this.startDate = moment().startOf('day').format(SystemConstant.TIME_FORMAT.DEFAULT);
        this.endDate = moment().endOf('day').format(SystemConstant.TIME_FORMAT.DEFAULT);
      },
      'month': () => {
        this.startDate = moment().startOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
        this.endDate = moment().endOf('month').format(SystemConstant.TIME_FORMAT.DEFAULT);
      }
    };
    typeTime[this.selectedType]();
    this._getDataPaymentPlan();
  }

  private _getDataPaymentPlan(options?: Query) {
    this.spinner.show();
    options = {
      clubKey: this.clubKey,
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.dashBoardSvc.getChartTotalRevenue(omitBy(options, isNil)).subscribe((res: any) => {
      const series = res.data.map(item => ({
        y: Number(item.total),
        name: item.paymentType || [this.translate.instant('DATA.DASHBOARDS.CHART.NO_VALUE')]
      }));
      this.totalRevenueChart = {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45
          },
          animation: true,
        },
        title: {
          text: ''
        },
        plotOptions: {
          series: {
            animation: {
              duration: 1000,
              easing: 'easeOutBounce'
            }
          },
          pie: {
            innerSize: 170,
            depth: 45,
            allowPointSelect: true,
            cursor: 'pointer',
            colors: ['#2f7ed8', '#7CDDDD', '#FF7300', '#910000', '#1aadce',
              '#492970', '#FF0000', '#77a1e5', '#007ED6', '#FFEC00'],
            dataLabels: {
              enabled: true,
              format: '<br>{point.percentage:.1f} %',
              // distance: -25,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 1,
              },
            },
          }
        },
        tooltip: {
          pointFormat: '{point.y}: <b>{point.percentage:.1f}%</b>',
          style: {
            fontFamily: 'Be Vietnam Pro, sans-serif',
          }
        },
        series: [{
          dataLabels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontWeight: '700',
            },
          },
          showInLegend: true,
          data: !series.length ? [{ y: 1, name: this.translate.instant('DATA.DASHBOARDS.CHART.NO_VALUE') }] : series,
          type: 'pie'
        }],
        legend: {
          itemStyle: {
            fontSize: '12px',
            fontFamily: 'Be Vietnam Pro, sans-serif',
            fontWeight: '700',
          },
          itemMarginTop: 10
        },
        credits: {
          enabled: false,
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 450,
              minWidth: 250
            },
            chartOptions: {
              plotOptions: {
                pie: {
                  innerSize: 50,
                  depth: 10,
                  dataLabels: {
                    distance: -35,
                    filter: {
                      property: 'percentage',
                      operator: '>',
                      value: 4,
                    },
                  },
                },
              },
            },
          }]
        }
      };
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
}