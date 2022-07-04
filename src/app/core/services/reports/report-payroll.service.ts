import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import * as querystring from 'querystring';

@Injectable({
  providedIn: 'root'
})

export class ReportPayrollService {
  API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
  ) { }

  public getListPtReportSalary(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/pt?` + options);
  }

  public getListLeaderReportSalary(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/leader?` + options);
  }

  public getListGroupRevenueReport(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/group?` + options);
  }

  public getListClubRevenueReport(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/club?` + options);
  }

  public getListGmSalaryReport(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/gm?` + options);
  }

  public getDetailPtRevenue(ptId: number, options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/pt/revenue/${ptId}?` + options);
  }

  public getDetailPtBonus(ptId: number, options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/pt/bonus/month/${ptId}?` + options);
  }

  public getDetailPtBonusRank(ptId: number, options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/pt/bonus/rank/${ptId}?` + options);
  };

  public getDetailPtBonusKeepRank(ptId: number, options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/pt/bonus/keep-rank/${ptId}?` + options);
  }

  public getDetailPtBonusSupport(ptId: number, options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/report/pt/bonus/support/${ptId}?` + options);
  }

  public addBonusPTSalary(options: any): Observable<[any]> {
    return this.http.post<[any]>(this.API_URL + `/pt/other-bonus/`, options);
  }
}