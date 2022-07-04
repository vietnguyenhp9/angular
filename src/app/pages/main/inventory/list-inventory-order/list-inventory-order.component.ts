import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { isNil, omitBy } from 'lodash';
import { getDataSelect, getPage, getTimeFormat } from 'src/app/core/utils';
import { ShareService } from 'src/app/core/services/share/share.service';
import { FormAddInventoryOrderComponent } from '../form-inventory/form-add-inventory-order/form-add-inventory-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormApproveInventoryOrderComponent } from '../form-inventory/form-approve-inventory-order/form-approve-inventory-order.component';
import { Order } from 'src/app/core/models/inventory/order.model';
import { FormConfirmInventoryOrderComponent } from '../form-inventory/form-confirm-inventory-order/form-confirm-inventory-order.component';
import { FormInStockInventoryOrderComponent } from '../form-inventory/form-in-stock-inventory-order/form-in-stock-inventory-order.component';
import * as moment from 'moment';
import { keyBy } from 'lodash';


@Component({
  selector: 'app-list-inventory-order',
  templateUrl: './list-inventory-order.component.html',
  styleUrls: ['./list-inventory-order.component.scss']
})
export class ListInventoryOrderComponent implements OnInit {

  // List 
  listInventoryOrder = [];
  listWarehouse = [];
  // Obj
  objSupplier = {}
  objWarehouse = {}
  // Filter
  selectedWarehouse: number;
  warehouseId: number;
  supplierId: number;
  searchValue: string;
  selectedCreatedAt: any;
  selectedApproveAt: any;
  selectedConfirmAt: any;
  now = new Date().toISOString().split('T')[0];
  today = moment().format('YYYY-MM-DD');
  startCreatedAt = null;
  endCreatedAt = null;
  startApprovedAt = null;
  endApprovedAt = null;
  startConfirmedAt = null;
  endConfirmedAt = null;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Format datetime
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  constructor(
    private inventorySvc: InventoryService,
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    private modalSvc: NgbModal,
    public translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.getListInventoryOrder();
    this._getListSupplier()
    this.listWarehouse = await getDataSelect(this.shareSvc.getListWarehouse());
    this.objWarehouse = keyBy(this.listWarehouse, 'id')
  }

  private _getListSupplier() {
    this.shareSvc.getListSupplier().subscribe((res: any) => {
      this.objSupplier = keyBy(res.data, 'id')
    })
  }

  public onSearch() {
    this.getListInventoryOrder();
  }

  public onChangeWarehouse(selectedWarehouse: any) {
    this.warehouseId = selectedWarehouse;
    this.page = 1;
    this.getListInventoryOrder();
  }

  public onFilterCreatedAt(selectedCreatedAt: any) {
    const { startDate, endDate } = selectedCreatedAt
    const sdIsOldValue = [this.startCreatedAt].includes(startDate)
    const edIsOldvalue = [this.endCreatedAt].includes(endDate)
    if (sdIsOldValue && edIsOldvalue) {
      return
    }
    this.startCreatedAt = startDate;
    this.endCreatedAt = endDate;
    this.page = 1;
    this.getListInventoryOrder();
  }

  public onFilterApproveAt(selectedApproveAt: any) {
    const { startDate, endDate } = selectedApproveAt
    const sdIsOldValue = [this.startApprovedAt].includes(startDate)
    const edIsOldvalue = [this.endApprovedAt].includes(endDate)
    if (sdIsOldValue && edIsOldvalue) {
      return
    }
    this.startApprovedAt = startDate;
    this.endApprovedAt = endDate;
    this.page = 1;
    this.getListInventoryOrder();

  }

  public onFilterConfirmAt(selectedConfirmAt: any) {
    const { startDate, endDate } = selectedConfirmAt
    const sdIsOldValue = [this.startConfirmedAt].includes(startDate)
    const edIsOldvalue = [this.endConfirmedAt].includes(endDate)
    if (sdIsOldValue && edIsOldvalue) {
      return
    }
    this.startConfirmedAt = startDate;
    this.endConfirmedAt = endDate;
    this.page = 1;
    this.getListInventoryOrder();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListInventoryOrder();
  }

  public getListInventoryOrder(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.searchValue,
      warehouseId: this.warehouseId,
      startCreatedAt: getTimeFormat(this.startCreatedAt),
      endCreatedAt: getTimeFormat(this.endCreatedAt),
      startApprovedAt: getTimeFormat(this.startApprovedAt),
      endApprovedAt: getTimeFormat(this.endApprovedAt),
      startConfirmedAt: getTimeFormat(this.startConfirmedAt),
      endConfirmedAt: getTimeFormat(this.endConfirmedAt),
      page: this.page,
      limit: this.pageSize,
    };
    this.inventorySvc.getListInventoryOrder(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.listInventoryOrder = res.data.result;
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  public createInventoryOrder() {
    const modalRef = this.modalSvc.open(
      FormAddInventoryOrderComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.listWarehouse = this.listWarehouse;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListInventoryOrder() : {};
    });
  }

  public approveInventoryOrder(item: Order) {
    const modalRef = this.modalSvc.open(
      FormApproveInventoryOrderComponent, {
      centered: true,
      size: 'md',
      backdrop: true
    });
    modalRef.componentInstance.InventoryOrder = item;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListInventoryOrder() : {};
    });
  }

  public confirmInventoryOrder(item: Order) {
    const modalRef = this.modalSvc.open(
      FormConfirmInventoryOrderComponent, {
      centered: true,
      size: 'lg',
      backdrop: true
    });
    modalRef.componentInstance.InventoryOrder = item;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListInventoryOrder() : {};
    });
  }

  public inStockInventory(item: Order) {
    const modalRef = this.modalSvc.open(
      FormInStockInventoryOrderComponent, {
      centered: true,
      size: 'xl',
      backdrop: true
    });
    modalRef.componentInstance.objWarehouse = this.objWarehouse;
    modalRef.componentInstance.objSupplier = this.objSupplier
    modalRef.componentInstance.InventoryOrder = item;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListInventoryOrder() : {};
    });
  }

}
