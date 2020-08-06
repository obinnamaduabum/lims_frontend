import { ValidatorFn, AbstractControl } from '@angular/forms';

export function CustomRangeValidatorMin(controlName: string, min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.parent || !control) {
      return;
    }
    try {
      if (!control.value) {
        return;
      }
      if (control.value) {
        // console.log(control.value);
        if (control.value < min) {
          return {minLengthExceeded: true};
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

