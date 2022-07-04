import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { ListInventoryOrderComponent } from './list-inventory-order/list-inventory-order.component';
import { ListProductCategoryComponent } from './list-product-category/list-product-category.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';
import { ListWarehouseInventoryComponent } from './list-warehouse-inventory/list-warehouse-inventory.component';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';

export const inventoryRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full'
  },
  {
    path: 'list-product-category',
    component: ListProductCategoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTPROCATE,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'list-product',
    component: ListProductComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTPRODUCT,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'list-warehouse',
    component: ListWarehouseComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_WAREHOUSE,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'list-warehouse-inventory',
    component: ListWarehouseInventoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.F_WAREHOUSE,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'list-supplier',
    component: ListSupplierComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTSUPPLIER,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  },
  {
    path: 'list-inventory-order',
    component: ListInventoryOrderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: SystemConstant.PERMISSIONS.G_LISTORDER,
        redirectTo: UrlConstant.ROUTE.MAIN.PAGE_404,
      }
    }
  }
];