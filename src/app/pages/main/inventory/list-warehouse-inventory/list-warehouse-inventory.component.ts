import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { isNil, omitBy } from 'lodash';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-list-warehouse-inventory',
  templateUrl: './list-warehouse-inventory.component.html',
  styleUrls: ['./list-warehouse-inventory.component.scss']
})
export class ListWarehouseInventoryComponent implements OnInit {

  // List 
  listWarehouseInventory = [];
  listWarehouse = [];

  // Filter
  warehouseId: number;
  selectedWarehouse: number;
  searchValue: string;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;

  constructor(
    private inventorySvc: InventoryService,
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    public translate: TranslateService
  ) { }

  async ngOnInit() {
    this.listWarehouse = await getDataSelect(this.shareSvc.getListWarehouse());
    this.selectedWarehouse = this.warehouseId = this.listWarehouse[0].id
    this.getListWareHouseInventory();
  }

  public onChangeWarehouse(selectedWarehouse: number) {
    this.warehouseId = selectedWarehouse;
    this.page = 1;
    this.getListWareHouseInventory();
  }

  public onSearch() {
    this.getListWareHouseInventory();
  }

  public getListWareHouseInventory(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.searchValue,
      warehouseId: this.warehouseId,
      page: this.page,
      limit: this.pageSize,
    }
    this.inventorySvc.getListWarehouseInventory(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.listWarehouseInventory = res.data.result;
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.spinner.hide();
      }, () => this.spinner.hide())
  }

}
