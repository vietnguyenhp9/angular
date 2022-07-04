import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { inventoryRoutes } from './inventory-routing.module';
import { ListProductCategoryComponent } from './list-product-category/list-product-category.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';
import { FormWarehouseComponent } from './form-inventory/form-warehouse/form-warehouse.component';
import { ListWarehouseInventoryComponent } from './list-warehouse-inventory/list-warehouse-inventory.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';
import { FormSupplierComponent } from './form-inventory/form-supplier/form-supplier.component';
import { ListInventoryOrderComponent } from './list-inventory-order/list-inventory-order.component';
import { FormAddInventoryOrderComponent } from './form-inventory/form-add-inventory-order/form-add-inventory-order.component';
import { FormApproveInventoryOrderComponent } from './form-inventory/form-approve-inventory-order/form-approve-inventory-order.component';
import { FormConfirmInventoryOrderComponent } from './form-inventory/form-confirm-inventory-order/form-confirm-inventory-order.component';
import { FormInStockInventoryOrderComponent } from './form-inventory/form-in-stock-inventory-order/form-in-stock-inventory-order.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormProductCategoryComponent } from './form-inventory/form-product-category/form-product-category.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { FormProductComponent } from './form-inventory/form-product/form-product.component';


export const pluginsModules = [
  NgbTooltipModule,
  NgSelectModule,
  TranslateModule,
  NgbNavModule,
  NgbPaginationModule,
  WidgetModule,
  FormsModule,
  PipesModule,
  NgxPermissionsModule.forChild(),
  NgxDaterangepickerMd.forRoot(),
  DropzoneModule,
];
@NgModule({
  declarations: [
    ListProductCategoryComponent,
    ListProductComponent,
    ListWarehouseComponent,
    FormWarehouseComponent,
    ListWarehouseInventoryComponent,
    ListSupplierComponent,
    FormSupplierComponent,
    ListInventoryOrderComponent,
    FormAddInventoryOrderComponent,
    FormApproveInventoryOrderComponent,
    FormConfirmInventoryOrderComponent,
    FormInStockInventoryOrderComponent,
    FormProductCategoryComponent,
    FormProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    pluginsModules,
    // Routers
    RouterModule.forChild(inventoryRoutes),
  ]
})
export class InventoryModule { }
