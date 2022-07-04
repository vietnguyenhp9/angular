import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
  ) { }

  public getCouponDetail(couponCode: any): Observable<any> {
    return this.http.get<any>(this.API_URL + `/global/coupon-detail?couponCode=${couponCode}`);
  }

  public checkValidCoupon(options: any): Observable<any> {
    return this.http.post<any>(this.API_URL + `/user/check-coupon`, options);
  }
}
