import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbAccordionModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { SimplebarAngularModule } from "simplebar-angular";
import { FormsShareModule } from "src/app/shared/forms/form-share.module";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { ListPtLeaderComponent } from "./list-pt-leader/list-pt-leader.component";
import { PtLeaderInfoDetailComponent } from "./pt-leader-info-detail/pt-leader-info-detail.component";
import { ptLeaderRoutes } from "./pt-leader-routing.module";
import { PtLeaderTabInformationComponent } from "./pt-leader-tab-information/pt-leader-tab-information.component";
import { PtLeaderTabRevenueComponent } from './pt-leader-tab-revenue/pt-leader-tab-revenue.component';
import { PtLeaderTabBonusComponent } from './pt-leader-tab-bonus/pt-leader-tab-bonus.component';
import { PtLeaderTabGroupHistoryComponent } from './pt-leader-tab-group-history/pt-leader-tab-group-history.component';
import { NgxPermissionsModule } from "ngx-permissions";

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
    ListPtLeaderComponent,
    PtLeaderInfoDetailComponent,
    PtLeaderTabInformationComponent,
    PtLeaderTabRevenueComponent,
    PtLeaderTabBonusComponent,
    PtLeaderTabGroupHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(ptLeaderRoutes),
  ]
})
export class PtLeaderModule { }