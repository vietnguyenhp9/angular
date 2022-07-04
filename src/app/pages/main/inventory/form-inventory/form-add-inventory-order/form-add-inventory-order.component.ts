import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Product } from 'src/app/core/models/inventory/product.model';
import { Warehouse } from 'src/app/core/models/inventory/warehouse.model';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';

@Component({
  selector: 'app-form-add-inventory-order',
  templateUrl: './form-add-inventory-order.component.html',
  styleUrls: ['./form-add-inventory-order.component.scss']
})
export class FormAddInventoryOrderComponent implements OnInit {
  // List
  @Input() listWarehouse: Warehouse[] = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  listProduct: Product[] = [];
  // Filter
  warehouseId: number;
  selectedWarehouse: number;
  // Form 
  form: FormGroup
  products: FormArray;
  createAt = moment.now();
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private inventorySvc: InventoryService,
    private alert: ToastrService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this._createForm();
  }

  public onChangeWarehouse(selectedWarehouse: any) {
    this.warehouseId = selectedWarehouse || null;
    this._getListProductByWarehouseId(this.warehouseId);
  }

  private _getListProductByWarehouseId(warehouseId: number) {
    this.inventorySvc.getListProductByWarehouseId(warehouseId)
      .subscribe((res: any) => {
        this.listProduct = res.data.result;
      });
  }

  private _createForm() {
    this.form = this.fb.group({
      warehouseId: [null, Validators.required],
      products: this.fb.array([this._createProduct()]),
      note: [''],
    })
  }

  private _createProduct(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, Validators.required],
    })
  }

  public addMoreProduct() {
    this.products = this.form.get('products') as FormArray;
    this.products.push(this._createProduct());
  }

  public removeProduct(i: any) {
    if (i != 0) {
      this.products.removeAt(i);
    }
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      this.inventorySvc.createInventoryOrder(this.form.value).subscribe(() => {
        this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
        this.closeModal.emit(true);
        this.activeModal.dismiss();
        this.spinner.hide();
      }, () => this.spinner.hide());
      return;
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
