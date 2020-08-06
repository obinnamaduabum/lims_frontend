import { ValidatorFn, AbstractControl } from '@angular/forms';
import {PhoneNumberCodes} from '../models/phone-number-codes-model';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export function PhoneNumberValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    // control.parent.get('nextOfKinSelectedPhoneNumber').value;

    if (!control.parent || !control) {
      return;
    }

    let phoneNumberCode: PhoneNumberCodes;
    if (controlName === 'nextOfKinPhoneNumber') {
      phoneNumberCode = control.parent.get('nextOfKinSelectedPhoneNumber').value;
    } else if (controlName === 'phoneNumber') {
      phoneNumberCode = control.parent.get('selectedPhoneNumber').value;
    } else if (controlName === 'otherPhoneNumber') {
      phoneNumberCode = control.parent.get('selectedOtherPhoneNumber').value;
    }

    let validNumber = false;
    try {
      if (!control.value) {
        return;
      }
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput('+' +
        phoneNumberCode.internationalPhoneNumber + control.value, phoneNumberCode.alpha2);
      validNumber = phoneNumberUtil.isValidNumber(phoneNumber);
      if (validNumber) {
        // console.log('isvalid');
        return;
      } else {
        // console.log('isinvalid');
        return {phoneNumberInvalid: true};
      }
    } catch (e) {

    }
    return {phoneNumberInvalid: true};
  };
}

