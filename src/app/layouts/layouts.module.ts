import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';

export const pluginsModules = [
  NgbDropdownModule,
  ClickOutsideModule,
  SimplebarAngularModule,
  NgxPermissionsModule
];
@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    TopbarComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    pluginsModules
  ],
})
export class LayoutsModule { }
