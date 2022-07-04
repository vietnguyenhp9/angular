import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';

@Component({
  selector: 'app-form-supplier',
  templateUrl: './form-supplier.component.html',
  styleUrls: ['./form-supplier.component.scss']
})
export class FormSupplierComponent implements OnInit {

  @Input() actionForm: any;
  @Input() supplier: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private inventorySvc: InventoryService,
    private alert: ToastrService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this._createForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [null, Validators.required],
      address: ['', Validators.required],
    })
    if (this.actionForm === SystemConstant.ACTION.EDIT) {
      this._patchValue(this.supplier);
    }
  }

  private _patchValue(supplier: any) {
    this.form.patchValue({
      name: supplier.name,
      phone: supplier.phone,
      address: supplier.address
    })
  }

  public onSubmit() {
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.inventorySvc.createSupplier(this.form.value)
          .subscribe(() => {
            this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
            this.closeModal.emit(true);
            this.activeModal.dismiss();
            this.spinner.hide();
          }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.inventorySvc.updateSupplier(this.supplier.id, this.form.value)
          .subscribe(() => {
            this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
            this.closeModal.emit(true);
            this.activeModal.dismiss();
            this.spinner.hide();
          }, () => this.spinner.hide());
      }
    }
    if (this.form.valid) {
      return actionType[this.actionForm]();
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

}
