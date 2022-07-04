import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { extrapagesRoutes } from './extrapages-routing.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { Page403Component } from './page403/page403.component';

export const pluginsModules = [
  TranslateModule,
];
@NgModule({
  declarations: [
    MaintenanceComponent,
    Page404Component,
    Page500Component,
    Page403Component,
  ],
  imports: [
    CommonModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(extrapagesRoutes)
  ]

})
export class ExtrapagesModule { }
