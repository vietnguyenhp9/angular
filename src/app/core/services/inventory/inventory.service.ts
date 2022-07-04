import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import { InventoryOrder } from '../../models/inventory/inventory-order.model';
import { Supplier } from '../../models/inventory/supplier.model';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
  ) { }

  public getListProductCategory(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/inventory/product-category?` + options);
  }

  public createProductCategory(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/inventory/product-category`, body);
  }

  public updateProductCategory(productCategoryId: string, body: any): Observable<any> {
    return this.http.put<any>(this.API_URL + `/inventory/product-category/${productCategoryId}`, body);
  }

  public deleteProductCategory(productCategoryId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/inventory/product-category/${productCategoryId}`);
  }

  public getProductList(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/inventory/product?` + options);
  }

  public createProduct(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/inventory/product`, body);
  }

  public getProductDetail(productId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + `/inventory/product/${productId}`);
  }

  public updateProduct(productId: string, body: any): Observable<any> {
    return this.http.put<any>(this.API_URL + `/inventory/product/${productId}`, body);
  }

  public deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/inventory/product/${productId}`);
  }

  public getListWarehouse(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/inventory/warehouse?` + options);
  }

  public createWarehouse(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/inventory/warehouse`, body);
  }

  public updateWarehouse(warehouseId: string, body: any): Observable<any> {
    return this.http.put<any>(this.API_URL + `/inventory/warehouse/${warehouseId}`, body);
  }

  public deleteWarehouse(warehouseId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/inventory/warehouse/${warehouseId}`);
  }

  public getListWarehouseInventory(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/inventory/warehouse-inventory?` + options);
  }

  public getListSupplier(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.API_URL + `/inventory/supplier`);
  }

  public createSupplier(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/inventory/supplier`, body);
  }

  public updateSupplier(supplierId: string, body: any): Observable<any> {
    return this.http.put<any>(this.API_URL + `/inventory/supplier/${supplierId}`, body);
  }

  public deleteSupplier(supplierId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/inventory/supplier/${supplierId}`);
  }


  public getListInventoryOrder(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/inventory/order?` + options);
  }

  public getListProductByWarehouseId(warehouseId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/inventory/product?` + warehouseId)
  }

  public createInventoryOrder(body: InventoryOrder): Observable<InventoryOrder[]> {
    return this.http.post<InventoryOrder[]>(this.API_URL + `/inventory/order`, body);
  }

  public approveInventoryOrder(body: any): Observable<any> {
    return this.http.post(this.API_URL + `/inventory/order/approve`, body);
  }

  public getListInventoryOrderById(id: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/inventory/order/${id}`);
  }

  public getListFee(): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/general/setting?key=list_order_fees`)
  }

  public createConfirmListInventoryOrder(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/inventory/order/confirm`, body);
  }
}
