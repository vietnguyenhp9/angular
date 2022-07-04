import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { ClassCalendarComponent } from './class-calendar/class-calendar.component';
import { ClassManagementComponent } from './class-management/class-management.component';
import { ListClassBookingComponent } from './list-class-booking/list-class-booking.component';

export const classRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full'
  },
  {
    path: 'class-calendar',
    component: ClassCalendarComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTCLASSCALBOOKING,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'list-class-booking',
    component: ListClassBookingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTCLASSBOOKING,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
  {
    path: 'class-management',
    component: ClassManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_CLASSES,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    },
  },
];
