import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
  ) { }

  public getChartNowInClub(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/now-in-club?` + options);
  }

  public getChartRevenueHistory(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/revenue-history?` + options);
  }

  public getChartPaymentPlan(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/payment-plan?` + options);
  }

  public getChartActiveMember(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/active-member?` + options);
  }

  public getChartTotalRevenue(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/revenue?` + options);
  }

  public getChartActiveMemberHistory(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/active-member-history?` + options);
  }

}
