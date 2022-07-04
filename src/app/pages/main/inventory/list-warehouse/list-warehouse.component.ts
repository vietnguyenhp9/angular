import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Query } from 'src/app/core/models/share/query.model';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect } from 'src/app/core/utils';
import { isNil, omitBy, keyBy } from 'lodash';
import { FormWarehouseComponent } from '../form-inventory/form-warehouse/form-warehouse.component';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-warehouse',
  templateUrl: './list-warehouse.component.html',
  styleUrls: ['./list-warehouse.component.scss']
})
export class ListWarehouseComponent implements OnInit {

  listWarehouse = []
  listClub = [];
  // Filter
  searchValue: string;
  clubId: number;
  selectedClub: number;
  // obj
  objClub = {}

  constructor(
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    private inventorySvc: InventoryService,
    private modalSvc: NgbModal,
    private alert: ToastrService,
    public translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this.objClub = keyBy(this.listClub, 'id')
    this._getListWarehouse();
  }

  private _getListWarehouse(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.searchValue,
      clubId: this.clubId,
    }
    this.inventorySvc.getListWarehouse(omitBy(options, isNil)).subscribe((res: any) => {
      this.listWarehouse = res.data.map((item) => ({
        ...item,
        clubInfo: this.objClub[item.clubId] || {}
      }));
      this.spinner.hide();
    }, () => this.spinner.hide())
  }

  private _deleteWarehouse(warehouseId: string) {
    this.spinner.show();
    this.inventorySvc.deleteWarehouse(warehouseId)
      .subscribe((res: any) => {
        if (res) {
          this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
          this._getListWarehouse();
          this.spinner.hide();
        }
      }, () => this.spinner.hide())
  }

  public onSearch() {
    this._getListWarehouse();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this._getListWarehouse();
    }
  }

  public addNewWarehouse() {
    const modalRef = this.modalSvc.open(
      FormWarehouseComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.actionForm = "CREATE";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListWarehouse() : {};
    });
  }

  public editWarehouse(item) {
    const modalRef = this.modalSvc.open(
      FormWarehouseComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.warehouse = item;
    modalRef.componentInstance.actionForm = "EDIT";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListWarehouse() : {};
    });
  }


  public deleteWarehouse(item) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = "FORM.DELETE_WAREHOUSE";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteWarehouse(item.id) : {};
    });
  }

}
