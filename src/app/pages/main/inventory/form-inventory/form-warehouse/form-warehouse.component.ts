import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect } from 'src/app/core/utils';

@Component({
  selector: 'app-form-warehouse',
  templateUrl: './form-warehouse.component.html',
  styleUrls: ['./form-warehouse.component.scss']
})
export class FormWarehouseComponent implements OnInit {

  @Input() actionForm: any;
  @Input() warehouse: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  // List 
  listClub = [];
  name: string;
  clubId: number;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    private inventorySvc: InventoryService,
    private alert: ToastrService,
    public translate: TranslateService
  ) { }

  async ngOnInit() {
    this._createForm();
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
  }

  private _createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      clubId: [null, Validators.required],
      address: ['', Validators.required],
    })
    if (this.actionForm === SystemConstant.ACTION.EDIT) {
      this._patchValue(this.warehouse);
    }
  }

  private _patchValue(warehouse: any) {
    this.form.patchValue({
      name: warehouse.name,
      clubId: parseInt(warehouse.clubId),
      address: warehouse.address
    })
  }

  public onSubmit() {
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.inventorySvc.createWarehouse(this.form.value)
          .subscribe(() => {
            this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
            this.closeModal.emit(true);
            this.activeModal.dismiss();
            this.spinner.hide();
          }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.inventorySvc.updateWarehouse(this.warehouse.id, this.form.value)
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


