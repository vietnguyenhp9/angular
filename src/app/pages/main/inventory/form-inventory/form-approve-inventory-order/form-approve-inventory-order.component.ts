import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';

@Component({
  selector: 'app-form-approve-inventory-order',
  templateUrl: './form-approve-inventory-order.component.html',
  styleUrls: ['./form-approve-inventory-order.component.scss']
})
export class FormApproveInventoryOrderComponent implements OnInit {

  @Input() InventoryOrder: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    private inventorySvc: InventoryService,
    private activeModal: NgbActiveModal,
    private alert: ToastrService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    
  }
  public onSubmit() {
    this.spinner.show()
    const body = {
      orderId: this.InventoryOrder.id,
      isOrdered: true,
    }
    this.inventorySvc.approveInventoryOrder(body).subscribe(() => {
      this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
      this.closeModal.emit(true);
      this.activeModal.dismiss();
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

}
