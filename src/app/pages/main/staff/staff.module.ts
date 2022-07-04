import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { ListStaffComponent } from './list-staff/list-staff.component';
import { StaffInfoDetailsComponent } from './staff-info-details/staff-info-details.component';
import { staffRoutes } from './staff-routing.module';
import { StaffTabAccessControlComponent } from './staff-tab-access-control/staff-tab-access-control.component';
import { StaffTabInformationComponent } from './staff-tab-information/staff-tab-information.component';


export const pluginsModules = [
  NgbTooltipModule,
  NgSelectModule,
  TranslateModule,
  NgbNavModule,
  NgbPaginationModule,
  WidgetModule,
  FormsModule,
  PipesModule,
  NgxPermissionsModule.forChild()
];
@NgModule({
  declarations: [
    ListStaffComponent,
    StaffInfoDetailsComponent,
    StaffTabInformationComponent,
    StaffTabAccessControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(staffRoutes),
  ]
})
export class StaffModule { }
