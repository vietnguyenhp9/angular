import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApexChartType } from 'src/app/core/models/common/apex.model';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { LanguageService } from 'src/app/core/services/common/language.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { numberFormatMoney } from 'src/app/core/utils';

@Component({
  selector: 'app-chart-now-in-club',
  templateUrl: './chart-now-in-club.component.html',
  styleUrls: ['./chart-now-in-club.component.scss']
})
export class ChartNowInClubComponent implements OnInit {

  @Input() listClub: Club[];
  @Input() userInfo: any;
  nowInClubChart: ApexChartType;
  // Filter
  clubId: number;
  type = '' || 'hour';
  // 
  selectedType = 'hour';
  selectedClub: number;
  isDisableSelected: boolean;
  memberOnline = 0;
  isShowMemberOnline = true;

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
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = true;
    }
    this._getDataNowInClub();
  }

  public onChangeClub() {
    this.clubId = this.selectedClub;
    this._getDataNowInClub();
  }

  public onChangeType() {
    this.type = this.selectedType;
    this._getDataNowInClub();
  }

  private _getDataNowInClub(options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      type: this.type,
    };
    this.dashBoardSvc.getChartNowInClub(omitBy(options, isNil)).subscribe((res: any) => {
      if (options.type === 'hour') {
        this.memberOnline = res.data[res.data.length - 1].value;
        this.isShowMemberOnline = true;
      }
      else {
        this.isShowMemberOnline = false;
      }
      const series = res.data.map(item => ({
        x: item.time.toString(),
        y: item.value,
        totalCheckin: item.totalCheckin || 0,
        totalCheckout: item.totalCheckout || 0
      }));
      const xaxis = res.data.map(item => item.time);
      this.nowInClubChart = {
        series: [{
          name: 'Member',
          data: series.slice(2),
        }],
        xaxis: {
          type: 'category',
          categories: xaxis.slice(2),
          labels: {
            style: {
              colors: '#898989',
              fontSize: '13px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontWeight: 700,
            },
            offsetY: 6,
          },
        },

        yaxis: {
          labels: {
            formatter: function (value) {
              return value;
            },
            style: {
              colors: '#898989',
              fontSize: '12px',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontWeight: 700,
            },
          },
        },
        tooltip: {
          custom: function ({ seriesIndex, dataPointIndex, w }) {
            var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            return '<ul class="chart-now-in-club">' +
              '<li><b>Member</b>: ' + data.y + '</li>' +
              '<li><b>Total Checkin</b>: ' + data.totalCheckin + '</li>' +
              '<li><b>Total Checkout</b>: ' + data.totalCheckout + '</li>';
            '</ul>';
          }
        },
        chart: {
          type: "area",
          height: 350,
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false,
            tools: {
              download: false,
              zoomin: false,
              zoomout: false,
              zoom: false,
            }
          },
          events: {
            scrolled: () => {
              // Call api khi kéo thả
              return;
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return numberFormatMoney(val);
          },
          textAnchor: 'end',
          offsetY: 15,
          offsetX: 0,
          style: {
            fontSize: "11.5px",
            fontFamily: 'Be Vietnam Pro, sans-serif',
            fontWeight: 700,
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        markers: {
          size: [5, 7],
          colors: undefined,
          strokeColors: '#fff',
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3
          }
        },
        responsive: [{
          breakpoint: 578,
          options: {
            chart: {
              height: 200,
            },
            yaxis: {
              show: false
            },
          }
        }]
      };
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
}
