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
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SimplebarAngularModule } from 'simplebar-angular';

import { ListTngPayComponent } from './list-tng-pay/list-tng-pay.component';
import { subscriptionsRoutes } from './subscriptions-routing.module';
import { TngPayTimelineComponent } from './tng-pay-timeline/tng-pay-timeline.component';
import { TngPayComponent } from './tng-pay/tng-pay.component';


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
  FormsModule,
];
@NgModule({
  declarations: [
    ListTngPayComponent,
    TngPayTimelineComponent,
    TngPayComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(subscriptionsRoutes),
  ]
})
export class SubscriptionsModule { }
