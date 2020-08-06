import {ValidatorFn, AbstractControl} from '@angular/forms';

export function CustomInputType(inputType: string): ValidatorFn {
  const phoneNumberRegex = /^\+?\d+$/;
  const alphabetRegex = /^[a-zA-Z]+$/;
  const numberRegex = /^[0-9.]+$/;
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.parent || !control) {
      return;
    }
    try {
      if (!control.value) {
        return;
      }
      if (inputType) {
        if (inputType === 'number') {
          if (numberRegex.test(control.value)) {
            return;
          } else {
            return {notNumber: true};
          }
        } else if (inputType === 'string') {
          if (alphabetRegex.test(control.value)) {
            return;
          } else {
            return {notString: true};
          }
        } else if (inputType === 'decimal') {
          return {notDecimal: true};
        } else {
          return;
        }
      }
    } catch (e) {
      return;
    }
    return;
  };
}

