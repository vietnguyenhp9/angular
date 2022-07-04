import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';

import { ReportCustomerComponent } from './customers/report-customer/report-customer.component';
import { ReportPayrollComponent } from './payroll/report-payroll/report-payroll.component';
import { ReportPtSalaryDetailComponent } from './payroll/report-pt-salary-detail/report-pt-salary-detail.component';
import { ReportRevenueComponent } from './revenue/report-revenue/report-revenue.component';

export const reportsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'revenue',
        pathMatch: 'full'
    },
    {
        path: 'revenue',
        component: ReportRevenueComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: SystemConstant.PERMISSIONS.F_REVENUE,
                redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
            }
        },
    },
    {
        path: 'payroll',
        component: ReportPayrollComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: SystemConstant.PERMISSIONS.F_PAYROLL,
                redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
            }
        },
    },
    {
        path: 'payroll/pt-detail/:id',
        component: ReportPtSalaryDetailComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: SystemConstant.PERMISSIONS.F_CUSTOMER,
                redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
            }
        },
    },
    {
        path: 'customers',
        component: ReportCustomerComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: SystemConstant.PERMISSIONS.F_CUSTOMER,
                redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
            }
        },
    },
];
