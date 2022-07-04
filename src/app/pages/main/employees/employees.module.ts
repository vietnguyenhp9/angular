import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbAccordionModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsShareModule } from 'src/app/shared/forms/form-share.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import {
  FormPtCalendarBookingDetailComponent,
} from './club/form-club/form-pt-calendar-booking-detail/form-pt-calendar-booking-detail.component';
import { GroupPtComponent } from './club/group-pt/group-pt.component';
import { ListRequestGmComponent } from './club/list-request-gm/list-request-gm.component';
import { ListRequestLeaderComponent } from './club/list-request-leader/list-request-leader.component';
import { PtCalendarBookingComponent } from './club/pt-calendar-booking/pt-calendar-booking.component';
import { employeesRoutes } from './employees-routing.module';
import { FormAddPtComponent } from './club/form-club/form-add-pt/form-add-pt.component';
import { NgxPermissionsModule } from 'ngx-permissions';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin,
]);

export const pluginsModules = [
  NgbTooltipModule,
  SimplebarAngularModule,
  NgSelectModule,
  TranslateModule,
  NgbNavModule,
  NgbPaginationModule,
  NgxDaterangepickerMd.forRoot(),
  WidgetModule,
  FormsModule,
  FullCalendarModule,
  FormsShareModule,
  NgbAccordionModule,
  NgxPermissionsModule.forChild()
];
@NgModule({
  declarations: [
    ListRequestGmComponent,
    ListRequestLeaderComponent,
    PtCalendarBookingComponent,
    GroupPtComponent,
    FormPtCalendarBookingDetailComponent,
    FormAddPtComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(employeesRoutes),
  ]
})
export class EmployeesModule { }
