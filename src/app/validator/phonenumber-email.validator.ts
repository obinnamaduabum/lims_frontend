import { ValidatorFn, AbstractControl } from '@angular/forms';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
import {PhoneNumberCodes} from '../models/phone-number-codes-model';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export function PhoneNumberAndEmailValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {

    const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneNumberRegex = /^\+?\d+$/;
    const alphabetRegex = /^[a-zA-Z]+$/;


    if (!control.parent || !control) {
      return;
    }

    // console.log('at: ' + control.value.toString().includes('@'));
    // console.log('alphabetRegex: ' + alphabetRegex.test(control.value));
    // console.log('email: ' + emailFormat.test(control.value));
    // console.log('phone number: ' + phoneNumberRegex.test(control.value));

    if (phoneNumberRegex.test(control.value)) {
      // control.parent.get('nextOfKinSelectedPhoneNumber').value;
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
          return;
        } else {
          return {phoneNumberInvalid: true};
        }
      } catch (e) {
        return;
      }
    } else {
      if (emailFormat.test(control.value)) {
        return;
      } else {
        return {emailInvalid: true};
      }
    }
  };
}

