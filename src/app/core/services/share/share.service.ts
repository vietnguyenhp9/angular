import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import { City } from '../../models/share/city.model';
import { Club } from '../../models/share/club.model';
import { District } from '../../models/share/district.model';
import { PaymentMethod } from '../../models/share/payment-method.model';
import { PaymentPlan } from '../../models/share/payment-plan.model';
import { PtPackage } from '../../models/share/pt-package.model';
import { UserProfile } from '../../models/share/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
  ) { }

  public getListClub(): Observable<Club[]> {
    return this.http.get<Club[]>(this.API_URL + `/general/club`);
  }

  public getClubDetailById(clubId: number): Observable<Club> {
    return this.http.get<Club>(this.API_URL + `/general/club/${clubId}`);
  }

  public getListPaymentPlan(): Observable<PaymentPlan[]> {
    return this.http.get<PaymentPlan[]>(this.API_URL + `/global/payment-plan`);
  }

  public getPtListPackage(): Observable<PtPackage[]> {
    return this.http.get<PtPackage[]>(this.API_URL + `/global/pt-package`);
  }

  public getListPaymentMethod(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.API_URL + `/general/payment-method`);
  }

  public getListPaymentPlanByClub(clubId: string): Observable<PaymentPlan[]> {
    return this.http.get<PaymentPlan[]>(this.API_URL + `/global/payment-plan-by-club/${clubId}`);
  }

  public getCityDetailById(cityId: number): Observable<City> {
    return this.http.get<City>(this.API_URL + `/general/city/detail/${cityId}`);
  }

  public getDistrictDetailById(districtId: number): Observable<District> {
    return this.http.get<District>(this.API_URL + `/general/district/detail/${districtId}`);
  }

  public getUserInfoById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.API_URL + `/user/member-info/${userId}`);
  }

  public getPaymentPlanDetailById(paymentId: number): Observable<PaymentPlan> {
    return this.http.get<PaymentPlan>(this.API_URL + `/global/payment-plan/${paymentId}`);
  }

  public getListCoupons(): Observable<any> {
    return this.http.get<any>(this.API_URL + `/global/coupons`);
  }

  public getListPtByClub(clubId: number): Observable<any> {
    return this.http.get<any>(this.API_URL + `/user/list-pt/${clubId}`);
  }

  public getListPtPackageByClub(clubId: number): Observable<any> {
    return this.http.get<any>(this.API_URL + `/global/pt-package-club/${clubId}`);
  }

  public getListGroupByClub(clubId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/general/club-pt-group/${clubId}`);
  }

  public getListPTByGroup(groupId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + `/pt/list-pt-in-group/${groupId}`);
  }

  public getListPtLeaderByClub(options: any): Observable<[]> {
    options = querystring.stringify(options);
    return this.http.get<[]>(this.API_URL + `/leader/list-leader?` + options);
  }

  public getPtLeaderByGroup(groupId: number): Observable<{}> {
    return this.http.get<{}>(this.API_URL + `/leader/leader-in-group/${groupId}`);
  }
  public getListCountry(): Observable<[]> {
    return this.http.get<[]>(this.API_URL + '/general/list-countries');
  }

  public getListCityByCountryId(countryId: number): Observable<City> {
    return this.http.get<City>(this.API_URL + '/general/list-city/' + countryId);
  }

  public getListDIstrictByCityId(cityId: number): Observable<[]> {
    return this.http.get<[]>(this.API_URL + '/general/list-district/' + cityId);
  }

  public getListRole(): Observable<[]> {
    return this.http.get<[]>(this.API_URL + '/auth/role');
  }

  public getListAccessRule(): Observable<[]> {
    return this.http.get<[]>(this.API_URL + '/global/access-rule-groups');
  }

  public getListWarehouse(): Observable<[]> {
    return this.http.get<[]>(this.API_URL + '/inventory/warehouse');
  }

  public getListSupplier(): Observable<[]> {
    return this.http.get<[]>(this.API_URL + '/inventory/supplier');
  }
}
