import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import * as querystring from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class ReportRevenueService {
  API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
  ) { }

  public getListReportMemberContract(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/member/contracts?` + options);
  }

  public getListReportMemberTransaction(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/member/transactions?` + options);
  }

  public getListReportPtContract(options: any): Observable<unknown> {
    options = querystring.stringify(options);
    return this.http.get<unknown>(this.API_URL + `/report/pt/contracts?` + options);
  }

  public getListReportPtTransaction(options: any): Observable<unknown> {
    options = querystring.stringify(options);
    return this.http.get<unknown>(this.API_URL + `/report/pt/transactions?` + options);
  }

  public getListReportProductTransaction(options: any): Observable<unknown> {
    options = querystring.stringify(options);
    return this.http.get<unknown>(this.API_URL + `/report/products?` + options);
  }

  public forceSync(): Observable<any> {
    return this.http.post<any>(this.API_URL + `/schedule/contracts`, {});
  }

  public getListActivePaymentMethod(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/global/payment-plan?` + options);
  }

}
