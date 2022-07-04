import { Component, OnInit } from '@angular/core';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { omitBy, isNil } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormProductComponent } from '../form-inventory/form-product/form-product.component';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  // List data
  listProduct = [];
  listProductCategory = [];
  // Filter 
  queryString: string;
  selectedProductCategory: number
  categoryId: number;
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Format datetime
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;

  constructor(
    private inventorySvc: InventoryService,
    private spinner: NgxSpinnerService,
    private modalSvc: NgbModal,
    private alert: ToastrService,
    public translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.listProductCategory = await getDataSelect(this.inventorySvc.getListProductCategory());
    this.getListProduct();
  }

  private _deleteProduct(productId: string) {
    this.spinner.show();
    this.inventorySvc.deleteProduct(productId).subscribe(res => {
      if (res) {
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
        this.getListProduct();
        this.spinner.hide();
      }
    }, () => this.spinner.hide())
  }

  public onSearch() {
    this.page = 1;
    this.getListProduct();
  }

  public onChangeProductCategory(selectedCategory: number) {
    if (![undefined, this.categoryId].includes(selectedCategory)) {
      this.categoryId = selectedCategory;
      this.page = 1;
      this.getListProduct();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListProduct();
  }

  public getListProduct(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.queryString,
      categoryId: this.categoryId,
      limit: this.pageSize,
      page: this.page
    }
    this.inventorySvc.getProductList(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.listProduct = res.data.result
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.spinner.hide();
      }, () => this.spinner.hide())
  }

  public addNewProduct() {
    const modalRef = this.modalSvc.open(
      FormProductComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.action = "CREATE";
    modalRef.componentInstance.listProductCategory = this.listProductCategory;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListProduct() : {};
    });
  }

  public updateProduct(product: any) {
    const modalRef = this.modalSvc.open(
      FormProductComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.action = "EDIT";
    modalRef.componentInstance.Product = product;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListProduct() : {};
    });
  }

  public deleteProduct(productCategoryId: string) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = "FORM.DELETE_PRODUCT";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteProduct(productCategoryId) : {};
    });
  }

}
