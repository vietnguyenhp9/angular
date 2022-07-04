import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
  ) { }

  public getListClubMember(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/list-members?` + options);
  }

  public getListMemberDebitTransactions(userId: string): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/user/list-debit-transactions/${userId}`);
  }

  public getListPtDebitTransactions(userId: string): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/user/list-pt-debit-transactions/${userId}`);
  }

  public getListMemberContracts(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/member-contracts/${userId}?` + options);
  }

  public getListMemberTransactions(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/member-contract-transactions/${userId}?` + options);
  }

  public getListPtContracts(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/pt-contracts/${userId}?` + options);
  }

  public getListPtTransactions(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/pt-contract-transactions/${userId}?` + options);
  }

  public getListMemberProducts(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/inventory/product-history?` + options);
  }

  public getListMemberAccessLog(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/access-log/${userId}?` + options);
  }

  public getMemberInteractions(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/note?` + options);
  }

  public getListMemberBooking(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/calendar/class-booking/${userId}?` + options);
  };

  public getListMemberPTBooking(userId: string, options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/calendar/pt-booking/${userId}?` + options);
  };

  public getListMemberChangesLog(options?: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/user/logs?` + options);
  }

  public getDetailMemberDebitTransaction(transactionId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + `/user/debit-transaction-detail/${transactionId}`);
  };

  public getDetailPtDebitTransaction(transactionId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + `/user/pt-debit-transaction-detail/${transactionId}`);
  };

  public getLastMemberContract(userId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + `/user/last-member-contract/${userId}`);
  }

  public getMemberPtBooking(userId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + `/user/pt-contract/${userId}?status=CURRENT`);
  }

  public getListClassForBooking(userId: string): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/user/list-class-booking/${userId}`);
  }


  public confirmContract(contractId: string): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/pt-confirm/${contractId}`, {});
  }

  public createMemberContract(model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/register-payment-plan`, model);
  }

  public createPtContract(model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/register-pt-contract`, model);
  }

  public deletePtContract(contractId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/user/pt-contract/${contractId}`);
  }

  public deleteMemberContract(contractId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/user/member-contract/${contractId}`);
  }

  public createManualTransaction(model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/add-manual-transaction`, model);
  }

  public deletePtTransaction(transactionId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/user/pt-transaction/${transactionId}`);
  }

  public deleteMemberTransaction(transactionId: string): Observable<any> {
    return this.http.delete<any>(this.API_URL + `/user/member-transaction/${transactionId}`);
  }

  public createPtTransaction(model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/add-manual-transaction`, model);
  }

  public freezeMemberContract(userId: string, model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/freeze-contract/${userId}`, model);
  }

  public unfreezeMemberContract(userId: string, model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/unfreeze-contract/${userId}`, model);
  }

  public addNote(model: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/note`, model);
  };

  public getListPTContractLog(ptContractId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + `/user/history-transfer/${ptContractId}`);
  }

  public editClassBookignDetail(accountId: string,body: any): Observable<any> {
    return this.http.put<any>(
      this.API_URL + `/user/calendar/class-booking/${accountId}`,
      body
    );
  }
}
