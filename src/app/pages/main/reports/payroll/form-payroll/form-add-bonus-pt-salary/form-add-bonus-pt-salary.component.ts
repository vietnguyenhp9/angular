import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportPayrollService } from 'src/app/core/services/reports/report-payroll.service';

@Component({
  selector: 'app-form-add-bonus-pt-salary',
  templateUrl: './form-add-bonus-pt-salary.component.html',
  styleUrls: ['./form-add-bonus-pt-salary.component.scss']
})
export class FormAddBonusPtSalaryComponent implements OnInit {
  @Input() ptInfo: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private reportPayrollSvc: ReportPayrollService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      ptId: [this.ptInfo.ptId, [Validators.required]],
      bonusAmount: [this.ptInfo.bonusAmount, [Validators.required]],
      reason: [this.ptInfo.reason, [Validators.required]],
      startDate: [this.ptInfo.startDate, [Validators.required]],
      endDate: [this.ptInfo.endDate, [Validators.required]],
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      this.reportPayrollSvc.addBonusPTSalary(this.form.value)
        .subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
