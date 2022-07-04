import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { ListPtComponent } from './list-pt/list-pt.component';
import { PtInfoDetailsComponent } from './pt-info-details/pt-info-details.component';

export const ptsRoutes: Routes = [
  {
    path: '',
    component: ListPtComponent,
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: PtInfoDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_PTINFO,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
];

