import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { transLang } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  public getClientErrorMessage(error: Error): string {
    return error.message
      ? error.message
      : error.toString();
  }

  public getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine && error.hasOwnProperty('error')
      ? `${error.status} - ${error.error.message} !`
      : transLang('ERROR.NO_INTERNET_CONNECTION');
  }
}
