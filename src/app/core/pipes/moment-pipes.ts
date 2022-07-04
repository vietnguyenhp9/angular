import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { SystemConstant } from '../constants/system.constant';

@Pipe({ name: 'momentFormat' })
export class MomentPipe implements PipeTransform {
  constructor() { }
  transform(value: Date | moment.Moment, dateFormat: string): any {
    const lang = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
    return moment(value).locale(lang).format(dateFormat);
  }
}