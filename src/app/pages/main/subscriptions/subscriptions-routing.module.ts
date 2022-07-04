import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';

import { TngPayComponent } from './tng-pay/tng-pay.component';

export const subscriptionsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full'
  },
  {
    path: 'tng-pay',
    component: TngPayComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_SUBSCRIPTION,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
];

