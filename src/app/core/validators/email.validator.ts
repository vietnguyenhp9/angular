import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export const customEmailValidator: ValidationErrors = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(control.value)) {
    return { invalidEmail: { valid: false, value: control.value } };
  } else {
    return Validators.email(control);
  }
};
