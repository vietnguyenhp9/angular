import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { ListClubMembersComponent } from './list-club-members/list-club-members.component';
import { MemberInfoDetailsComponent } from './member-info-details/member-info-details.component';

export const memberRoutes: Routes = [
  {
    path: '',
    component: ListClubMembersComponent,
    pathMatch: 'full',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_CLUBMEMBER,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  },
  {
    path: ':id',
    component: MemberInfoDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_MEMINF,
        redirectTo: UrlConstant.ROUTE.MAIN.DASHBOARD,
      }
    },
  }

];

