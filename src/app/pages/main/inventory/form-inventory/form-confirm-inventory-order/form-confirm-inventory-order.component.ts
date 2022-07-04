import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { getDataSelect } from 'src/app/core/utils';

@Component({
  selector: 'app-form-confirm-inventory-order',
  templateUrl: './form-confirm-inventory-order.component.html',
  styleUrls: ['./form-confirm-inventory-order.component.scss']
})
export class FormConfirmInventoryOrderComponent implements OnInit {

  @Input() InventoryOrder: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Form 
  form: FormGroup;
  formProduct: FormGroup;
  // List 
  listInventoryOrder = [];
  listSupplier = [];
  listFee = [];
  // Data
  netPrice: number;
  VATPrice: number;
  fee: number;
  total: number;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private inventorySvc: InventoryService,
    private alert: ToastrService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  async ngOnInit() {
    this._createForm();
    this._getListProductByInventoryOrderId();
    this._getListFee();
    this.listSupplier = await getDataSelect(this.inventorySvc.getListSupplier());
  }

  private _createProduct(item: any) {
    this.formProduct = this.fb.group({
      productName: [item.nameEn],
      productId: [item.productId],
      quantity: [item.quantity, [Validators.required]],
      costPrice: [null, [Validators.required]],
      supplierId: [item.supplierId, Validators.required],
    });
    this.products.push(this.formProduct);
  }

  private _getListProductByInventoryOrderId() {
    this.spinner.show();
    this.inventorySvc.getListInventoryOrderById(this.InventoryOrder.id)
      .subscribe((res: any) => {
        this.listInventoryOrder = res.data.products;
        res.data.products.map((item: any) => {
          this._createProduct(item);
        });
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  private _getListFee() {
    this.inventorySvc.getListFee().subscribe((res: any) => {
      this.listFee = res.data.settingValueEn.split(',');
    })
  }

  private _createForm() {
    this.form = this.fb.group({
      products: this.fb.array([]),
      VAT: ['0', [Validators.required]],
      fees: this.fb.array([this._createFee()]),
      orderId: this.InventoryOrder.id
    });
  }

  private _createFee(): FormGroup {
    return this.fb.group({
      key: [null, Validators.required],
      value: [null, Validators.required],
    })
  }

  private _onChangeNetPrice() {
    this.netPrice = 0;
    for (const control of this.products.controls) {
      this.netPrice += Number(control['controls']['quantity'].value) * Number(control['controls']['costPrice'].value);
    }
  }

  private _onChangeVat() {
    this.VATPrice = 0;
    this.VATPrice = ((this.netPrice + this.fee) / 100) * Number(this.form.controls['VAT'].value);
  }

  private _onChangeFee() {
    this.fee = 0;
    for (const control of this.fees.controls) {
      this.fee += Number(control['controls']['value'].value);
    }
  }

  public addMoreFee() {
    this.fees.push(this._createFee());
  }

  public removeFee(i: any) {
    if (i != 0) {
      this.fees.removeAt(i);
      this.onChangePrice();
    }
  }

  get products() {
    return this.form.controls['products'] as FormArray;
  }

  get fees() {
    return this.form.controls['fees'] as FormArray;
  }

  public getProductName(i: any) {
    return this.products.controls[i]['controls']['productName'].value;
  }

  public onChangePrice() {
    this._onChangeNetPrice();
    this._onChangeFee();
    this._onChangeVat();
    this.total = this.netPrice + this.VATPrice + this.fee;
  }

  public onSubmit() {
    const fee = {};
    for (const control of this.fees.controls) {
      const key = control['controls']['key'].value;
      fee[key] = control['controls']['value'].value;
    }
    const body = {
      orderId: this.InventoryOrder.id,
      VAT: this.form.controls['VAT'].value.toString(),
      fees: fee,
      products: this.form.controls['products'].value,
    };
    if (this.form.valid) {
      this.inventorySvc.createConfirmListInventoryOrder(body).subscribe(() => {
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
