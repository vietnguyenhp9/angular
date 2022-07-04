import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Query } from 'src/app/core/models/share/query.model';
import { ImagesService } from 'src/app/core/services/images/images.service';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { FormProductCategoryComponent } from '../form-inventory/form-product-category/form-product-category.component';


@Component({
  selector: 'app-list-product-category',
  templateUrl: './list-product-category.component.html',
  styleUrls: ['./list-product-category.component.scss']
})
export class ListProductCategoryComponent implements OnInit {

  listProductCategory: any;
  // Filter 
  searchValue: string;
  imgUrl: string;

  constructor(
    private inventorySvc: InventoryService,
    private imgSvc: ImagesService,
    private spinner: NgxSpinnerService,
    private modalSvc: NgbModal,
    private alert: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit() {
    this._getListProductCategory();
  }

  private _getListProductCategory(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.searchValue,
    };
    this.inventorySvc.getListProductCategory(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.listProductCategory = res.data.result
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  private _deleteProductCategory(productCategoryId: string) {
    this.spinner.show();
    this.inventorySvc.deleteProductCategory(productCategoryId).subscribe(res => {
      if (res) {
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
        this._getListProductCategory();
        this.spinner.hide();
      }
    }, () => this.spinner.hide())
  }

  public onSearch() {
    this._getListProductCategory();
  }

  public getImage(url: string) {
    const imgUrl = {
      id: url
    }
    return this.imgSvc.getImage(imgUrl);
  }

  public addNewProductCategory() {
    const modalRef = this.modalSvc.open(
      FormProductCategoryComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.action = "CREATE";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListProductCategory() : {};
    });
  }

  public updateProductCatgory(productCategory: any) {
    const modalRef = this.modalSvc.open(
      FormProductCategoryComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.action = "EDIT";
    modalRef.componentInstance.productCategory = productCategory;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListProductCategory() : {};
    });
  }

  public deleteProductCategory(productCategoryId: string) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = "FORM.DELETE_PRODUCT_CATEGORY";
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteProductCategory(productCategoryId) : {};
    });
  }

}
