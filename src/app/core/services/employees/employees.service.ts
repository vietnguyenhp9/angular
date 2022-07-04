import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  public getListRequestGm(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/gm/list-request-gm?` + options);
  }

  public getListRequestLeader(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/gm/list-request-leader?` + options
    );
  }

  public approveRejectRequest(requestId: string, status: {}): Observable<any> {
    return this.http.put<any>(
      this.API_URL + `/gm/update-status-request/${requestId}`,
      status
    );
  }

  public getListGm(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/gm/list-gm?` + options);
  }

  public getListPTLeader(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/leader/list-leader?` + options);
  }

  public getListPT(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/pt/list-pt?` + options);
  }

  public getListPTCalendarBooking(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/pt/calendar?` + options);
  }

  public getListPTBooking(ptId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/list-pt-bookings/${ptId}?` + options
    );
  }

  public getGmInfoById(gmId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/gm/info/${gmId}`);
  }

  public getListPTContracts(useId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/list-pt-contracts/${useId}?` + options
    );
  }

  public getListPTSession(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/list-pt-session/${userId}?` + options
    );
  }

  public getListPTAccessLog(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/user/access-log/${userId}?` + options
    );
  }

  public getGmRevenueById(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/gm/revenue/${userId}?` + options);
  }

  public getGmBonusById(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/gm/bonus/${userId}?` + options);
  }

  public getPtLeaderRevenueById(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/leader/revenue/${userId}?` + options
    );
  }

  public getPtLeaderBonusByIdByMonth(
    userId: string,
    options?: any
  ): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/leader/payroll/overview/${userId}?` + options
    );
  }

  public getPtLeaderHistoryGroupById(
    userId: string,
    options?: any
  ): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/leader/group-history/${userId}?` + options
    );
  }

  public getPtRevenueById(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/pt/revenue/${userId}?` + options);
  }

  public getPtBonusOverview(userId: string, options?: any): Observable<{}> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/payroll/overview/${userId}?` + options
    );
  }

  public getPtPayrollContract(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/payroll/contracts/${userId}?` + options
    );
  }

  public getPtBonusRank(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/payroll/rank/${userId}?` + options
    );
  }

  public getPtBonusKeepRank(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/payroll/keep-rank/${userId}?` + options
    );
  }

  public getPtGroupHistory(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(
      this.API_URL + `/pt/group-history/${userId}?` + options
    );
  }

  public deletePtGroup(options: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + `/pt/remove-pt-in-group`,
      options
    );
  }

  public deletePtLeaderGroup(options: any): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/leader/assignment`, options);
  }

  public getListPtLeaderForGroup(clubId: number): Observable<[]> {
    return this.http.get<[]>(
      this.API_URL + `/leader/list-free-leader/${clubId}`
    );
  }

  public addPtGroup(options: any): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/pt/add-pt-group`, options);
  }

  public addPtLeaderGroup(options: any): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/leader/assignment`, options);
  }

  public getMemberContractDetailById(contractId: string): Observable<{}> {
    return this.http.get<{}>(
      this.API_URL + `/user/member-contract/${contractId}`
    );
  }

  public editPtContract(options: any): Observable<{}> {
    return this.http.put<{}>(
      this.API_URL + `/user/update-pt-contract/`,
      options
    );
  }

  public editMemberContract(contractId: string, options: any): Observable<{}> {
    return this.http.put<{}>(
      this.API_URL + `/user/member-contract/${contractId}`,
      options
    );
  }

  public editMemberTransactions(
    transactionId: string,
    options: any
  ): Observable<{}> {
    return this.http.put<{}>(
      this.API_URL + `/user/member-contract-transactions/${transactionId}`,
      options
    );
  }

  public editPtTransactions(
    transactionId: string,
    options: any
  ): Observable<{}> {
    return this.http.put<{}>(
      this.API_URL + `/user/pt-contract-transactions/${transactionId}`,
      options
    );
  }

  public createNewEmployees(options: any): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/auth/register-account`, options);
  }

  public transferPT(body: any): Observable<{}> {
    return this.http.post<{}>(this.API_URL + `/pt/transfer-pt`, body);
  }

  public getListStaff(options: any): Observable<{}> {
    options = querystring.stringify(options);
    return this.http.get<{}>(
      this.API_URL + `/employee/list-employees?` + options
    );
  }
}
