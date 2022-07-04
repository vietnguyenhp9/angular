import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ChartNowInClubComponent } from './char-now-in-club/chart-now-in-club.component';
import { ChartActiveMemberComponent } from './chart-active-member/chart-active-member.component';
import { ChartPaymentPlanComponent } from './chart-payment-plan/chart-payment-plan.component';
import { ChartRevenueHistoryComponent } from './chart-revenue-history/chart-revenue-history.component';
import { ChartTotalRevenueComponent } from './chart-total-revenue/chart-total-revenue.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { NoDashboardComponent } from './no-dashboard/no-dashboard.component';
import { ChartActiveMemberHistoryComponent } from './chart-active-member-history/chart-active-member-history.component';
import { NgxEchartsModule } from 'ngx-echarts';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardsComponent
  }
];

export const pluginsModules = [
  NgApexchartsModule,
  NgSelectModule,
  TranslateModule,
  HighchartsChartModule,
  NgbTooltipModule,
  NgxPermissionsModule.forChild(),
  NgxEchartsModule.forRoot({
    echarts: () => import('echarts')
  })
];
@NgModule({
  declarations: [
    DashboardsComponent,
    ChartNowInClubComponent,
    ChartRevenueHistoryComponent,
    ChartPaymentPlanComponent,
    ChartActiveMemberComponent,
    ChartTotalRevenueComponent,
    NoDashboardComponent,
    ChartActiveMemberHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    pluginsModules,
    // Router
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardsModule { }
