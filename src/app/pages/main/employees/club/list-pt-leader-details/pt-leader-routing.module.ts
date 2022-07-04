import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { ListPtLeaderComponent } from './list-pt-leader/list-pt-leader.component';
import { PtLeaderInfoDetailComponent } from './pt-leader-info-detail/pt-leader-info-detail.component';

export const ptLeaderRoutes: Routes = [
  {
    path: '',
    component: ListPtLeaderComponent,
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: PtLeaderInfoDetailComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LEADERINFO,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
];
