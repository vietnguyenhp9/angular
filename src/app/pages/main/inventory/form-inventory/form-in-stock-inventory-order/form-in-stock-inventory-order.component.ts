import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';


@Component({
  selector: 'app-form-in-stock-inventory-order',
  templateUrl: './form-in-stock-inventory-order.component.html',
  styleUrls: ['./form-in-stock-inventory-order.component.scss']
})
export class FormInStockInventoryOrderComponent implements OnInit {

  @Input() InventoryOrder: any;
  @Input() objWarehouse: any;
  @Input() objSupplier: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  // List data 
  listInventoryOrderDetail = [];
  listProductOrderDetail = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;

  constructor(
    private inventorySvc: InventoryService,
    private spinner: NgxSpinnerService,
    private activeModal: NgbActiveModal,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getListInventoryOrderDetail();
  }

 
  private getListInventoryOrderDetail() {
    this.spinner.show()
    this.inventorySvc.getListInventoryOrderById(this.InventoryOrder.id)
      .subscribe((res: any) => {
        this.listInventoryOrderDetail = [res.data].map((item: any) => ({
          ...item,
          warehouseName: this.objWarehouse[item.warehouseId]?.name || '',
        }))
        this.listProductOrderDetail = res.data.products.map((item: any) => ({
          ...item,
          fee: JSON.parse(item.orderFee),
          supplierName: this.objSupplier[item.supplierId]?.name || ''
        }));
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

}
