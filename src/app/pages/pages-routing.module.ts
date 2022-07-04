import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from '../core/constants/system.constant';
import { UrlConstant } from '../core/constants/url.constant';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardsComponent } from './main/dashboards/dashboards/dashboards.component';

export const pagesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'club-members',
    loadChildren: () => import('./main/member/member.module').then(m => m.MemberModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_CLIENT,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
  {
    path: 'employees',
    loadChildren: () => import('./main/employees/employees.module').then(m => m.EmployeesModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_PT,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
  {
    path: 'subscriptions',
    loadChildren: () => import('./main/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_SUBSCRIPTION,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
  {
    path: 'reports',
    loadChildren: () => import('./main/reports/reports.module').then(m => m.ReportsModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_REPORT,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
  {
    path: 'staff',
    loadChildren: () => import('./main/staff/staff.module').then(m => m.StaffModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_STAFF,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
  {
    path: 'inventory',
    loadChildren: () => import('./main/inventory/inventory.module').then(m => m.InventoryModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_STAFF,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'class',
    loadChildren: () => import('./main/class/class.module').then(m => m.ClassModule),
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_CLASS,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
];
