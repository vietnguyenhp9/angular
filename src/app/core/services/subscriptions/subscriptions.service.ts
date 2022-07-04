import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import { SystemConstant } from '../../constants/system.constant';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
  ) { }

  public getListSubscriptions(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/subscription?` + options);
  }

  public getSubscriptionsLogs(subId: string, options: any): Observable<any> {
    options = querystring.stringify(options);
    const locale = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
    const headers = new HttpHeaders({ 'Accept-Language': locale });
    return this.http.get<any>(this.API_URL + `/user/subscription-logs/${subId}?` + options, { headers: headers });
  }

  public getListPaymentPlanSubscriptions(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/global/payment-plan-subscription?` + options);
  };

}
