import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/core/models/inventory/supplier.model';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { FormSupplierComponent } from '../form-inventory/form-supplier/form-supplier.component';

@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.scss']
})
export class ListSupplierComponent implements OnInit {

  listSupplier: Supplier[];

  constructor(
    private spinner: NgxSpinnerService,
    private inventorySvc: InventoryService,
    public translate: TranslateService,
    private alert: ToastrService,
    private modalSvc: NgbModal,
  ) { }

  ngOnInit(): void {
    this._getListSupplier();
  }

  private _getListSupplier() {
    this.spinner.show();
    this, this.inventorySvc.getListSupplier()
      .subscribe((res: any) => {
        this.listSupplier = res.data;
        this.spinner.hide();
      }, () => this.spinner.hide())
  }

  private _deleteSupplier(supplierId: string) {
    this.spinner.show();
    this.inventorySvc.deleteSupplier(supplierId)
      .subscribe((res: any) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
          this._getListSupplier();
          this.spinner.hide();
        }
      }, () => this.spinner.hide())
  }

  public addSupplier() {
    const modalRef = this.modalSvc.open(
      FormSupplierComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.actionForm = "CREATE";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListSupplier() : {};
    });
  }

  public updateSupplier(item: any) {
    const modalRef = this.modalSvc.open(
      FormSupplierComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.actionForm = "EDIT";
    modalRef.componentInstance.supplier = item;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListSupplier() : {};
    });
  }

  public deleteSupplier(item: any) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = "FORM.DELETE_SUPPLIER";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteSupplier(item.id) : {};
    });
  }

}


