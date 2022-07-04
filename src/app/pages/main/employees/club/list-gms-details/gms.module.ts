import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsShareModule } from 'src/app/shared/forms/form-share.module';
import { GmInfoDetailsComponent } from './gm-info-details/gm-info-details.component';
import { gmsRoutes } from './gms-routing.module';
import { ListGmComponent } from './list-gm/list-gm.component';
import { GmTabRevenueComponent } from './gm-tab-revenue/gm-tab-revenue.component';
import { GmTabBonusComponent } from './gm-tab-bonus/gm-tab-bonus.component';
import { GmTabInformationComponent } from './gm-tab-information/gm-tab-information.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { FormAddEmployeeComponent } from '../form-club/form-add-employee/form-add-employee.component';
import { NgxPermissionsModule } from 'ngx-permissions';


export const pluginsModules = [
  NgbTooltipModule,
  SimplebarAngularModule,
  NgSelectModule,
  TranslateModule,
  NgbNavModule,
  NgbPaginationModule,
  WidgetModule,
  FormsModule,
  FormsShareModule,
  NgbAccordionModule,
  NgxPermissionsModule.forChild(),
];
@NgModule({
  declarations: [
    ListGmComponent,
    GmInfoDetailsComponent,
    GmTabRevenueComponent,
    GmTabBonusComponent,
    GmTabInformationComponent,
    FormAddEmployeeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(gmsRoutes),
  ]
})
export class GmsModule { }
