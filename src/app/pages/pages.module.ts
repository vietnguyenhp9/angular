import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { pagesRoutes } from './pages-routing.module';

export const pluginsModules = [
  NgbDropdownModule,
  NgbModalModule,
  NgApexchartsModule,
  NgbNavModule,
  NgbTooltipModule,
  NgbCollapseModule,
  SimplebarAngularModule,
  TranslateModule,
  NgSelectModule,
  NgxEchartsModule
];
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    pluginsModules,
    // Router
    RouterModule.forChild(pagesRoutes)
  ],
})
export class PagesModule { }
