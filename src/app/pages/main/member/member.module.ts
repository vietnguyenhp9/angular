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
import { FormsShareModule } from 'src/app/shared/forms/form-share.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormAddClassBookingComponent } from './form-members/form-add-class-booking/form-add-class-booking.component';
import { FormAddMemberContractComponent } from './form-members/form-add-member-contract/form-add-member-contract.component';
import {
  FormAddMemberTransactionsComponent,
} from './form-members/form-add-member-transactions/form-add-member-transactions.component';
import {
  FormAddNoteInteractionsComponent,
} from './form-members/form-add-note-interactions/form-add-note-interactions.component';
import { FormAddPtContractComponent } from './form-members/form-add-pt-contract/form-add-pt-contract.component';
import { FormAddPtTransactionsComponent } from './form-members/form-add-pt-transactions/form-add-pt-transactions.component';
import {
  FormClassBookingDetailComponent,
} from './form-members/form-class-booking-detail/form-class-booking-detail.component';
import {
  FormFreezeMemberContractComponent,
} from './form-members/form-freeze-member-contract/form-freeze-member-contract.component';
import { ListClubMembersComponent } from './list-club-members/list-club-members.component';
import { memberRoutes } from './member-routing.module';
import { MemberTabAccessControlComponent } from './member-tab-access-control/member-tab-access-control.component';
import { MemberTabBookingsComponent } from './member-tab-bookings/member-tab-bookings.component';
import { MemberTabChangesComponent } from './member-tab-changes/member-tab-changes.component';
import { MemberTabContractComponent } from './member-tab-contract/member-tab-contract.component';
import { MemberInfoDetailsComponent } from './member-info-details/member-info-details.component';
import { MemberTabInformationComponent } from './member-tab-information/member-tab-information.component';
import { MemberTabInteractionsComponent } from './member-tab-interactions/member-tab-interactions.component';
import { MemberTabProductComponent } from './member-tab-product/member-tab-product.component';
import { MemberTabPtContractComponent } from './member-tab-pt-contract/member-tab-pt-contract.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FormEditMemberContractComponent } from './form-members/form-edit-member-contract/form-edit-member-contract.component';
import { FormEditMemberTransactionsComponent } from './form-members/form-edit-member-transactions/form-edit-member-transactions.component';
import { FormEditPtTransactionsComponent } from './form-members/form-edit-pt-transactions/form-edit-pt-transactions.component';
import { FormEditPtContractComponent } from './form-members/form-edit-pt-contract/form-edit-pt-contract.component';
import { FormTransferPtContractComponent } from './form-members/form-transfer-pt-contract/form-transfer-pt-contract.component';
import { FormTransferPtContractLogComponent } from './form-members/form-transfer-pt-contract-log/form-transfer-pt-contract-log.component';


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
  PipesModule,
  NgxPermissionsModule.forChild()
];
@NgModule({
  declarations: [
    ListClubMembersComponent,
    MemberInfoDetailsComponent,
    MemberTabInformationComponent,
    MemberTabContractComponent,
    MemberTabPtContractComponent,
    MemberTabProductComponent,
    MemberTabAccessControlComponent,
    MemberTabInteractionsComponent,
    MemberTabBookingsComponent,
    MemberTabChangesComponent,
    FormAddMemberContractComponent,
    FormAddMemberTransactionsComponent,
    FormAddPtContractComponent,
    FormAddPtTransactionsComponent,
    FormFreezeMemberContractComponent,
    FormAddNoteInteractionsComponent,
    FormAddClassBookingComponent,
    FormClassBookingDetailComponent,
    FormEditMemberContractComponent,
    FormEditMemberTransactionsComponent,
    FormEditPtTransactionsComponent,
    FormEditPtContractComponent,
    FormTransferPtContractComponent,
    FormTransferPtContractLogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(memberRoutes),
  ]
})
export class MemberModule { }
