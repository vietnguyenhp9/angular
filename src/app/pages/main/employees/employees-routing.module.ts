import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { GroupPtComponent } from './club/group-pt/group-pt.component';
import { ListRequestGmComponent } from './club/list-request-gm/list-request-gm.component';
import { ListRequestLeaderComponent } from './club/list-request-leader/list-request-leader.component';
import { PtCalendarBookingComponent } from './club/pt-calendar-booking/pt-calendar-booking.component';

export const employeesRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full'
  },
  {
    path: 'request-gm',
    component: ListRequestGmComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTPTREQUESTSALEGM,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
  {
    path: 'request-leader',
    component: ListRequestLeaderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTPTREQUESTSALELEADER,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
  {
    path: 'list-gm',
    loadChildren: () => import('./club/list-gms-details/gms.module').then(m => m.GmsModule),
  },
  {
    path: 'list-pt-leader',
    loadChildren: () => import('./club/list-pt-leader-details/pt-leader.module').then(m => m.PtLeaderModule)
  },
  {
    path: 'list-pt',
    loadChildren: () => import('./club/list-pts-details/pts.module').then(m => m.PtsModule)
  },
  {
    path: 'pt-calendar-booking',
    component: PtCalendarBookingComponent
  },
  {
    path: 'group-pt',
    component: GroupPtComponent
  }
];

