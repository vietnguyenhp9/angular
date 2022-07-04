import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';
import { isNil, omitBy } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { LanguageService } from 'src/app/core/services/common/language.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-chart-active-member-history',
  templateUrl: './chart-active-member-history.component.html',
  styleUrls: ['./chart-active-member-history.component.scss'],
})
export class ChartActiveMemberHistoryComponent implements OnInit {
  lineChart: EChartsOption;
  selectedClub = false;
  isTotal: boolean = false;
  selectedType = 'day';
  type: any = 'day';
  endPoint = 0;
  oldDataChart = [];
  initSeries: any;
  newSeries: any;
  resetChart: any;
  time = [];
  newTime = [];
  startPercentage: number;

  constructor(
    private dashBoardSvc: DashboardService,
    private spinner: NgxSpinnerService,
    public languageSvc: LanguageService,
    public translate: TranslateService,
    public shareSvc: ShareService
  ) { }

  ngOnInit(): void {
    this._getChartActiveMemberHistory();
  }


  public onCheckTotal() {
    this.isTotal = this.selectedClub;
    this.endPoint = 0;
    this._getChartActiveMemberHistory();
  }

  public onChangeType() {
    this.type = this.selectedType;
    this.endPoint = 0;
    this._getChartActiveMemberHistory();
  }

  public async getValue(event: any) {
    if (event.batch[0].start == 0) {
      this.endPoint += 12;
      await this._getDataForChart();
    }
  }

  private _getDataForChart(options?: Query) {
    options = {
      isTotal: this.isTotal,
      type: this.type,
      endPoint: this.endPoint,
    };
    this.dashBoardSvc
      .getChartActiveMemberHistory(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.newTime = this.time = res.data.time
          .map((item) => moment(item).format(SystemConstant.TIME_FORMAT.YY_MM_DD))
          .concat(this.time);
        const clubName = [];
        const series = [];
        res.data.values.map((item) => {
          clubName.push(item.clubKey);
          series.push({
            ...item,
            name: item.clubKey,
            type: 'line',
            data: [...item.data],
          });
        });
        this.newSeries = this.initSeries.map((item, i) => ({
          ...item,
          data: [...series[i].data, ...item.data],
        }));
        this.initSeries = this.newSeries;
        this.lineChart = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: clubName,
          },
          animation: false,
          animationEasingUpdate: 'linear',
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          dataZoom: {
            type: 'inside',
            startValue: this.newTime[11],
            endValue: this.newTime[21],
            zoomLock: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.newTime,
            axisLabel: {
              fontSize: '13px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              color: '#898989',
              fontStyle: 'normal',
              fontWeight: 'bold',
              interval: 0,
              hideOverlap: true,
              formatter: function (value) {
                const date = new Date(value);
                const x = moment(date).format(options.type === 'day'
                  ? `${SystemConstant.TIME_FORMAT.DD}/${SystemConstant.TIME_FORMAT.MM}`
                  : `${SystemConstant.TIME_FORMAT.MM}/${SystemConstant.TIME_FORMAT.YY}`
                );
                return x;
              },
            },
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisLabel: {
              fontSize: '13px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              color: '#898989',
              fontStyle: 'normal',
              fontWeight: 'bold',
            },
          },
          media: [
            {
              query: {
                minWidth: 435,
              },
              option: {
                xAxis: {
                  data: this.newTime,
                  axisLabel: {
                    formatter: function (value) {
                      const date = new Date(value);
                      const x = moment(date).format(options.type === 'day'
                        ? `${SystemConstant.TIME_FORMAT.DD}/${SystemConstant.TIME_FORMAT.MM}`
                        : `${SystemConstant.TIME_FORMAT.MM}/${SystemConstant.TIME_FORMAT.YY}`
                      );
                      return x;
                    },
                  },
                },
              },
            },
            {
              query: {
                maxWidth: 435,
              },
              option: {
                xAxis: {
                  data: this.newTime,
                  axisLabel: {
                    formatter: function (value) {
                      const date = new Date(value);
                      const x = moment(date).format(options.type === 'day'
                        ? `${SystemConstant.TIME_FORMAT.DD}`
                        : `${SystemConstant.TIME_FORMAT.MM}`);
                      return x;
                    },
                  },
                },
              },
            },
          ],
          series: this.newSeries,
        };
      });
  }

  private _getChartActiveMemberHistory(options?: Query) {
    this.spinner.show();
    options = {
      isTotal: this.isTotal,
      type: this.type,
      endPoint: this.endPoint,
    };
    this.dashBoardSvc
      .getChartActiveMemberHistory(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.time = res.data.time.map((item) =>
          moment(item).format(SystemConstant.TIME_FORMAT.YY_MM_DD)
        );
        const clubName = [];
        const series = [];
        res.data.values.map((item) => {
          clubName.push(item.clubKey);
          series.push({
            ...item,
            name: item.clubKey,
            type: 'line',
            data: item.data,
          });
          this.initSeries = series;
          this.oldDataChart.push(item.data);
        });
        this.lineChart = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: clubName,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          dataZoom: {
            type: 'inside',
            startValue: this.time[2],
            end: 100,
            zoomLock: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.time,
            axisLabel: {
              fontSize: '13px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              color: '#898989',
              fontStyle: 'normal',
              fontWeight: 'bold',
              showMaxLabel: false,
              interval: 0,
              hideOverlap: true,
              formatter: function (value) {
                const date = new Date(value);
                const x = moment(date).format(options.type === 'day'
                  ? `${SystemConstant.TIME_FORMAT.DD}/${SystemConstant.TIME_FORMAT.MM}`
                  : `${SystemConstant.TIME_FORMAT.MM}/${SystemConstant.TIME_FORMAT.YY}`);
                return x;
              },
            },
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisLabel: {
              fontSize: '13px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              color: '#898989',
              fontStyle: 'normal',
              fontWeight: 'bold',
            },
          },
          media: [
            {
              query: {
                minWidth: 435,
              },
              option: {
                xAxis: {
                  axisLabel: {
                    formatter: function (value) {
                      const date = new Date(value);
                      const x = moment(date).format(options.type === 'day'
                        ? `${SystemConstant.TIME_FORMAT.DD}/${SystemConstant.TIME_FORMAT.MM}`
                        : `${SystemConstant.TIME_FORMAT.MM}/${SystemConstant.TIME_FORMAT.YY}`);
                      return x;
                    },
                  },
                },
              },
            },
            {
              query: {
                maxWidth: 435,
              },
              option: {
                xAxis: {
                  axisLabel: {
                    formatter: function (value) {
                      const date = new Date(value);
                      const x = moment(date).format(options.type === 'day'
                        ? `${SystemConstant.TIME_FORMAT.DD}`
                        : `${SystemConstant.TIME_FORMAT.MM}`);
                      return x;
                    },
                  },
                },
              },
            },
          ],
          series: series,
        };
        this.spinner.hide();
      },
        () => this.spinner.hide()
      );
  }
}
