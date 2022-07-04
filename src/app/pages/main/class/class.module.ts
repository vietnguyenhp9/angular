import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ClassCalendarComponent } from './class-calendar/class-calendar.component';
import { ClassManagementComponent } from './class-management/class-management.component';
import { classRoutes } from './class-routing.module';
import {
  FormClassCalendarDetailComponent,
} from './form-class/form-class-calendar-detail/form-class-calendar-detail.component';
import { FormClassCategoryComponent } from './form-class/form-class-category/form-class-category.component';
import { FormClassComponent } from './form-class/form-class/form-class.component';
import { FormScheduleClassComponent } from './form-class/form-schedule-class/form-schedule-class.component';
import { ListClassBookingComponent } from './list-class-booking/list-class-booking.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin,
]);


export const pluginsModules = [
  NgbTooltipModule,
  NgSelectModule,
  TranslateModule,
  NgbNavModule,
  NgbPaginationModule,
  FormsModule,
  NgxPermissionsModule.forChild(),
  FullCalendarModule,
  DropzoneModule,
  NgxDaterangepickerMd.forRoot(),
];
@NgModule({
  declarations: [
    ClassCalendarComponent,
    FormClassCalendarDetailComponent,
    FormScheduleClassComponent,
    ClassManagementComponent,
    FormClassCategoryComponent,
    FormClassComponent,
    ListClassBookingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(classRoutes),
  ]
})
export class ClassModule { }
