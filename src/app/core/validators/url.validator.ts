import { AbstractControl, ValidationErrors } from '@angular/forms';

export const urlValidator: ValidationErrors = (control: AbstractControl) => {
  // Match URL
  if (!control.value) {
    return null;
  } else {
    const valid = /^http[s]{0,1}:\/\/.{1,}$/.test(control.value);
    return valid ? null : { invalidUrl: { valid: false, value: control.value } };
  }
};
