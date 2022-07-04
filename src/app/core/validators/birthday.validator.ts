import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export function checkBirthday(input: FormControl) {
  const value = moment(input.value);
  const year = moment().diff(value, 'years');
  return year >= 16 ? null : { missMatchBirthDay: true };
}