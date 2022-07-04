import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormConfirmBoxComponent } from './form-confirm-box/form-confirm-box.component';
import { TranslateModule } from '@ngx-translate/core';

export const pluginsModules = [
  TranslateModule,
  NgSelectModule,
  ClickOutsideModule
];
@NgModule({
  declarations: [
    FormConfirmBoxComponent
  ],
  imports: [
    CommonModule,
    pluginsModules
  ],
  exports: [FormConfirmBoxComponent]
})
export class FormsShareModule { }
