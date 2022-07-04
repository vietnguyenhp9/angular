import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import * as StackTraceParser from 'error-stack-parser';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.local';

import { SystemConstant } from '../constants/system.constant';
import { AuthenticationService } from '../services/common/auth.service';
import { ErrorService } from '../services/common/error.service';
import { send } from '../utils';

const SEND_SLACK_ENV = ['production', 'staging'];
@Injectable()
export class ErrorClientHandler implements ErrorHandler {

  constructor(
    private injector: Injector,
    private zone: NgZone,
  ) { }

  public handleError(error: Error) {
    // Define services
    // const errorSvc = this.injector.get(ErrorService);
    const spinner = this.injector.get(NgxSpinnerService);
    // const alert = this.injector.get(ToastrService);
    // 
    setTimeout(() => {
      spinner.hide();
    }, 250);
    if (!(error instanceof HttpErrorResponse)) {
      // Client error
      // const message = errorSvc.getClientErrorMessage(error);
      // Had an issue with the alert being ran outside of angular's zone.
      this.zone.run(() => {
        // alert.error(message);
      });
      // Send error client to slack
      this._notificationError(error);
    }
  }

  /**
   * Push notification error to slack channel
   * @param error 
   */
  private _notificationError(error: Error): any {
    // Injector Services
    const authSvc = this.injector.get(AuthenticationService);
    const errorSvc = this.injector.get(ErrorService);
    // Data send slack
    const nameError = error.name;
    const message = errorSvc.getClientErrorMessage(error);
    const stackTraces = error.stack.split('at');
    const method = stackTraces[2].substr(0, stackTraces[2].indexOf('(') - 1);
    const accountId = authSvc.getUserProfileLocal()?.accountId;
    const userAgent = window.navigator.userAgent;
    const timeStamp = moment().format(SystemConstant.TIME_FORMAT.ERROR_TIME);
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    // End Data send slack
    const slackPreContent = `:boom: :boom: :boom:
    nameError: \`${nameError || 'empty'}\` 
    Message: \`${message || 'empty'}\` 
    Method: \`${method || 'empty'}\`
    accountId: \`${accountId} || 'empty'\`
    User agent: \`${userAgent || 'empty'}\`
    timeStamp: \`${timeStamp || 'empty'}\`
    url: \`${url || 'empty'}\`
    `;
    const slackMessage = StackTraceParser.parse(error);
    if (SEND_SLACK_ENV.includes(environment.ENV)) {
      send(slackPreContent, slackMessage, 'ERROR_SLACK_CHANNEL');
    }
  }
}