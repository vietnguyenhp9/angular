import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbAccordionModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsShareModule } from 'src/app/shared/forms/form-share.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ListPtComponent } from './list-pt/list-pt.component';
import { PtTabAccessControlComponent } from './pt-tab-access-control/pt-tab-access-control.component';
import { PtTabBonusComponent } from './pt-tab-bonus/pt-tab-bonus.component';
import { PtTabBookingsComponent } from './pt-tab-bookings/pt-tab-bookings.component';
import { PtInfoDetailsComponent } from './pt-info-details/pt-info-details.component';
import { PtTabInformationComponent } from './pt-tab-information/pt-tab-information.component';
import { PtTabPtContractComponent } from './pt-tab-pt-contract/pt-tab-pt-contract.component';
import { PtTabPtGroupHistoryComponent } from './pt-tab-pt-group-history/pt-tab-pt-group-history.component';
import { PtTabPtSessionComponent } from './pt-tab-pt-session/pt-tab-pt-session.component';
import { PtTabRevenueComponent } from './pt-tab-revenue/pt-tab-revenue.component';
import { ptsRoutes } from './pts-routing.module';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
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
  WidgetModule,
  FormsModule,
  FormsShareModule,
  NgbAccordionModule,
  PipesModule,
  FullCalendarModule,
  NgxPermissionsModule.forChild(),
];
@NgModule({
  declarations: [
    ListPtComponent,
    PtTabInformationComponent,
    PtInfoDetailsComponent,
    PtTabPtContractComponent,
    PtTabPtSessionComponent,
    PtTabAccessControlComponent,
    PtTabBookingsComponent,
    PtTabRevenueComponent,
    PtTabBonusComponent,
    PtTabPtGroupHistoryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(ptsRoutes),
  ]
})
export class PtsModule { }
