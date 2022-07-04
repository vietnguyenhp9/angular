import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ReportCustomerComponent } from './customers/report-customer/report-customer.component';
import { ReportClubRevenueComponent } from './payroll/report-club-revenue/report-club-revenue.component';
import { ReportGmSalaryComponent } from './payroll/report-gm-salary/report-gm-salary.component';
import { ReportGroupRevenueComponent } from './payroll/report-group-revenue/report-group-revenue.component';
import { ReportLeaderSalaryComponent } from './payroll/report-leader-salary/report-leader-salary.component';
import { ReportPayrollComponent } from './payroll/report-payroll/report-payroll.component';
import { ReportPtSalaryDetailComponent } from './payroll/report-pt-salary-detail/report-pt-salary-detail.component';
import { ReportPtSalaryComponent } from './payroll/report-pt-salary/report-pt-salary.component';
import { reportsRoutes } from './reports-routing.module';
import { ReportMemberContractComponent } from './revenue/report-member-contract/report-member-contract.component';
import { ReportMemberTransactionComponent } from './revenue/report-member-transaction/report-member-transaction.component';
import {
  ReportProductTransactionComponent,
} from './revenue/report-product-transaction/report-product-transaction.component';
import { ReportPtContractComponent } from './revenue/report-pt-contract/report-pt-contract.component';
import { ReportPtTransactionComponent } from './revenue/report-pt-transaction/report-pt-transaction.component';
import { ReportRevenueComponent } from './revenue/report-revenue/report-revenue.component';
import { FormAddBonusPtSalaryComponent } from './payroll/form-payroll/form-add-bonus-pt-salary/form-add-bonus-pt-salary.component';
import { ReportCustomerExpiredComponent } from './customers/report-customer-expired/report-customer-expired.component';
import { ReportCustomerExpiringComponent } from './customers/report-customer-expiring/report-customer-expiring.component';
import { ReportCustomerActiveComponent } from './customers/report-customer-active/report-customer-active.component';
import { ReportCustomerActiveUnuseComponent } from './customers/report-customer-active-unuse/report-customer-active-unuse.component';

export const pluginsModules = [
  NgbTooltipModule,
  SimplebarAngularModule,
  NgSelectModule,
  TranslateModule,
  NgbNavModule,
  NgbPaginationModule,
  NgxDaterangepickerMd.forRoot(),
  NgxPermissionsModule
];
@NgModule({
  declarations: [
    ReportRevenueComponent,
    ReportMemberContractComponent,
    ReportMemberTransactionComponent,
    ReportPtContractComponent,
    ReportPtTransactionComponent,
    ReportProductTransactionComponent,
    ReportPayrollComponent,
    ReportPtSalaryComponent,
    ReportGmSalaryComponent,
    ReportLeaderSalaryComponent,
    ReportGroupRevenueComponent,
    ReportClubRevenueComponent,
    ReportPtSalaryDetailComponent,
    FormAddBonusPtSalaryComponent,
    ReportCustomerComponent,
    ReportCustomerExpiredComponent,
    ReportCustomerExpiringComponent,
    ReportCustomerActiveComponent,
    ReportCustomerActiveUnuseComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(reportsRoutes)
  ]
})
export class ReportsModule { }
