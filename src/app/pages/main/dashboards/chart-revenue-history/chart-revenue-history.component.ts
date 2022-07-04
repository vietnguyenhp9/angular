import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import { isNil, omitBy } from 'lodash';
// import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { LanguageService } from 'src/app/core/services/common/language.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-chart-revenue-history',
  templateUrl: './chart-revenue-history.component.html',
  styleUrls: ['./chart-revenue-history.component.scss'],
})
export class ChartRevenueHistoryComponent implements OnInit, OnDestroy {
  @ViewChild('revenueHistory') componentRef;
  chartRef;
  updateFlag = true;
  @Input() listClub: Club[];
  @Input() userInfo: any;
  // Filter
  clubKey: string;
  type: any = 'day';
  typeTransaction: string;
  // endPoint = 0;
  // 
  selectedType = 'day';
  selectedClub: string;
  selectedTransaction: string = 'total';
  isDisableSelected: boolean;
  // HighChart
  Highcharts: typeof Highcharts = Highcharts;
  revenueHistoryChart: Highcharts.Options;
  setIntervalChart: any;  // setInterval
  minIndex: number;

  constructor(
    private dashBoardSvc: DashboardService,
    private spinner: NgxSpinnerService,
    public languageSvc: LanguageService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubKey = this.userInfo.clubKey;
      this.selectedClub = this.userInfo.clubKey;
      this.isDisableSelected = true;
    }
    this._getDataRevenueHistory();
  }

  public onChangeClub() {
    this.clubKey = this.selectedClub;
    // this.chartRef.destroy();
    this.componentRef.chart = null;
    this._getDataRevenueHistory();
  }

  public onChangeType() {
    this.type = this.selectedType;
    // this.chartRef.destroy();
    this.componentRef.chart = null;
    this._getDataRevenueHistory();
  }

  public onChangeTransaciton() {
    this.typeTransaction = (this.selectedTransaction !== 'total') ? this.selectedTransaction : null;
    this.componentRef.chart = null;
    this._getDataRevenueHistory();
  }

  private _getDataRevenueHistory(options?: Query) {
    this.spinner.show();
    options = {
      clubKey: this.clubKey,
      type: this.type,
      typeTransaction: this.typeTransaction,
      endPoint: 0,
    };
    this.dashBoardSvc.getChartRevenueHistory(omitBy(options, isNil)).subscribe((res: any) => {
      const series = res.data;
      const xaxis = res.data.map(item => item.x);
      this.minIndex = xaxis[0];
      this.revenueHistoryChart = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'column',
          height: '365',
          panning: {
            enabled: true
          },
          pinchType: 'x',
          zoomType: null,
          resetZoomButton: {
            theme: {
              style: {
                display: 'none'
              }
            }
          },
          events: {
            load: function (e) {
              const chart = e.target;
              let currentExtremes;
              // Create extremes checker
              this.setIntervalChart = setInterval(() => {
                if (chart.xAxis) {
                  currentExtremes = chart.xAxis[0].getExtremes();
                  const { min } = currentExtremes;
                  // Condition for loading new data
                  if (min === this.minIndex) {
                    // chart.showLoading('Loading New Data...');  // spinner
                    setTimeout(() => {
                      // Get current chart data 
                      const currentSeries = chart.series[0].options.data;
                      const currentxAxis = chart.series[0].options.data.map(item => item.x);
                      // ---- Call api get data ----
                      options.endPoint = currentSeries.length;
                      options.type = this.type;
                      this.dashBoardSvc.getChartRevenueHistory(omitBy(options, isNil)).subscribe((res: any) => {
                        const newSeries = res.data;
                        const newxAxis = res.data.map(item => item.x);
                        this.minIndex = newxAxis[0];
                        // Update chart with appended new data
                        chart.series[0].update({ data: [...newSeries, ...currentSeries] });
                        chart.xAxis[0].update({ min: [...newxAxis, ...currentxAxis][2], tickPositions: [...newxAxis, ...currentxAxis] });
                      });
                      // ---- End call api ----
                      // chart.hideLoading();
                    }, 200);
                  }
                }
              }, 500);
            }.bind(this)
          }
        },
        series: [{
          data: series,
          showInLegend: false,
          type: 'column',
          dataLabels: {
            style: {
              fontSize: '11px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
            }
          },
          enableMouseTracking: true,
        }],
        xAxis: {
          units: [
            [options.type, [1]]
          ],
          tickPositions: xaxis,
          type: 'datetime',
          alignTicks: true,
          min: xaxis[2],
          max: xaxis[xaxis.length - 1],
          labels: {
            align: options.type === 'day' ? 'center' : 'center',
            style: {
              fontSize: '13px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              color: '#898989',
              fontWeight: '700',
            },
            formatter: function () {
              const formatType = options.type === 'day' ? '%d/%m' : '%m/%y';
              return Highcharts.dateFormat(formatType, new Date(this.value).getTime());
            },
          },
          crosshair: true,
          title: {
            text: null,
          },
        },
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            style: {
              fontSize: '12px',
              color: '#898989',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontWeight: '700',
            }
          }
        },
        title: {
          text: null,
        },
        tooltip: {
          followTouchMove: false,
          pointFormat: '{point.y}',
          style: {
            fontFamily: 'Be Vietnam Pro, sans-serif',
          }
        },
        accessibility: {
          point: {
            valueSuffix: '%',
          },
        },
        plotOptions: {
          column: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
            },
            borderRadius: 4,
            color: '#088ffb',
            pointWidth: 35
          },
        },
        credits: {
          enabled: false,
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 435,
              minWidth: 200
            },
            chartOptions: {
              chart: {
                height: 215
              },
              series: [{
                type: 'column',
                dataLabels: {
                  style: {
                    fontSize: '10px',
                  }
                }
              }],
              plotOptions: {
                column: {
                  borderRadius: 4,
                  color: '#088ffb',
                  pointWidth: 18
                },
              },
              xAxis: {
                labels: {
                  formatter: function () {
                    const formatType = options.type === 'day' ? '%d' : '%m';
                    return Highcharts.dateFormat(formatType, new Date(this.value).getTime());
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

  public chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  public ngOnDestroy(): void {
    clearInterval(this.setIntervalChart);
  }
}
