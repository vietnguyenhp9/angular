import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { environment } from 'src/environments/environment.local';


@Injectable({
  providedIn: 'root'
})
export class ReportCustomerService {
  API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
  ) { }

  public getListCustomerActive(options: any) {
    options = querystring.stringify(options);
    return this.http.get(this.API_URL + `/report/customer/active?` + options);
  }

  public getListCustomerExpired(options: any) {
    options = querystring.stringify(options);
    return this.http.get(this.API_URL + `/report/customer/expired?` + options);
  }

  public getListCustomerExpiring(options: any) {
    options = querystring.stringify(options);
    return this.http.get(this.API_URL + `/report/customer/expiring?` + options);
  }

  public getListCustomerActiveUnuse(options: any) {
    options = querystring.stringify(options);
    return this.http.get(this.API_URL + `/report/customer/active/unuse?` + options);
  }
}
