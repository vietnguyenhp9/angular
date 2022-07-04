import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import { AuthenticationService } from '../services/common/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  API = environment.API_URL;
  constructor(
    private authSvc: AuthenticationService,
  ) { }

  /**
   * Token Interceptor
   * @param request 
   * @param next 
   * @returns 
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set header for all request
    if (
      request.url.includes(this.API + '/auth/access-token') &&
      this.authSvc.getRefToken() !== null
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authSvc.getRefToken()}`,
        },
      });
    } else if (this.authSvc.getAccessToken() !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authSvc.getAccessToken()}`,
        },
      });
    }
    return next.handle(request);
  }
}
