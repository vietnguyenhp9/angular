import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { ListStaffComponent } from './list-staff/list-staff.component';
import { StaffInfoDetailsComponent } from './staff-info-details/staff-info-details.component';

export const staffRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
  },
  {
    path: 'list-staff',
    component: ListStaffComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTSTAFF,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      },
    },
  },
  {
    path: ':id',
    component: StaffInfoDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTSTAFF,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      },
    },
  },
];
