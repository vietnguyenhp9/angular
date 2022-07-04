import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { GmInfoDetailsComponent } from './gm-info-details/gm-info-details.component';
import { ListGmComponent } from './list-gm/list-gm.component';

export const gmsRoutes: Routes = [
  {
    path: '',
    component: ListGmComponent,
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: GmInfoDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_GMINFO,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
];

