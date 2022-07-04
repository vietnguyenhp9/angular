import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import { isNil, omitBy, sum } from 'lodash';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { LanguageService } from 'src/app/core/services/common/language.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-chart-active-member',
  templateUrl: './chart-active-member.component.html',
  styleUrls: ['./chart-active-member.component.scss']
})
export class ChartActiveMemberComponent implements OnInit {
  @Input() listClub: Club[];
  @Input() userInfo: any;
  // Filter
  clubId: number;
  type = '' || 'day';
  startDate: string;
  endDate: string;
  // 
  selectedClub: number;
  isDisableSelected: boolean;
  // HighChart
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = true;
  activeMemberChart: Highcharts.Options;

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
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = true;
    }
    this._getDataActiveMember();
  }

  public onChangeClub() {
    this.clubId = this.selectedClub;
    this._getDataActiveMember();
  }

  private _getDataActiveMember(options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.dashBoardSvc.getChartActiveMember(omitBy(options, isNil)).subscribe((res: any) => {
      const total = sum(res.data.map(item => Number(item.total)));
      const series = res.data.map(item => ({
        y: Number(item.total),
        name: item.paymentPlanKey + '(' + item.total + ')'
      }));
      this.activeMemberChart = {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45
          },
          animation: true
        },
        title: {
          text: 'TOTAL ACTIVE MEMBER: ' + total,
          align: 'center',
          verticalAlign: 'top',
          style: {
            fontSize: '15px',
            fontWeight: '700',
          }
        },
        plotOptions: {
          series: {
            animation: {
              duration: 1000,
              easing: 'easeOutBounce'
            }
          },
          pie: {
            innerSize: 120,
            depth: 45,
            allowPointSelect: true,
            cursor: 'pointer',
            colors: ['#52D726', '#FFEC00', '#FF7300', '#910000', '#1aadce',
              '#492970', '#FF0000', '#77a1e5', '#007ED6', '#7CDDDD'],
            dataLabels: {
              enabled: true,
              format: '<br>{point.percentage:.1f} %',
              distance: -35,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 4,
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
              fontSize: '13px',
              fontWeight: '700',
            },
          },
          showInLegend: true,
          data: series,
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
