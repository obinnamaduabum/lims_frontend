import {AbstractControl} from '@angular/forms';

export function PasswordMatchValidator(control: AbstractControl): any {
  if (!control.parent || !control) {
    return;
  }
  const pwd = control.parent.get('password');
  const cpwd = control.parent.get('confirmPassword');

  if (!pwd || !cpwd) {
    return;
  }
  if (pwd.value !== cpwd.value) {
    return {passwordMatchInvalid: true};
  }
}
