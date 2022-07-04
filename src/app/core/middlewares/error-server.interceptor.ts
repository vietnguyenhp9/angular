import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/common/auth.service';
import { ErrorService } from '../services/common/error.service';

@Injectable()
export class ErrorServerInterceptor implements HttpInterceptor {

  constructor(
    private zone: NgZone,
    private spinner: NgxSpinnerService,
    private authSvc: AuthenticationService,
    private errorSvc: ErrorService,
    private alert: ToastrService
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => {
      this._handleError(error);
      return throwError(error);
    }));
  }
  /**
* Handler error 
* @param error 
* @returns
*/
  private _handleError(error: HttpErrorResponse): void {
    setTimeout(() => {
      this.spinner.hide();
    }, 250);
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return this.authSvc.logout();
      }
      // Server error
      const message = this.errorSvc.getServerErrorMessage(error);
      // Had an issue with the alert being ran outside of angular's zone.
      this.zone.run(() => {
        this.alert.error(message);
      });
    }
  }
}