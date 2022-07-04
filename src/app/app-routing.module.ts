import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AuthRoutingModule } from './auth/auth-routing';
import { SystemConstant } from './core/constants/system.constant';
import { UrlConstant } from './core/constants/url.constant';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { Page404Component } from './pages/extrapages/page404/page404.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivateChild: [AuthGuard],
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.SYSTEM_PERMISSIONS.CRM,
        redirectTo: UrlConstant.ROUTE.AUTH.LOGIN,
      }
    },
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/extrapages/extrapages.module').then(m => m.ExtrapagesModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.SYSTEM_PERMISSIONS.CRM,
        redirectTo: UrlConstant.ROUTE.AUTH.LOGIN,
      }
    },
  },
  {
    path: '**',
    component: Page404Component
  },
  {
    path: '404',
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule, AuthRoutingModule]
})

export class AppRoutingModule { }
