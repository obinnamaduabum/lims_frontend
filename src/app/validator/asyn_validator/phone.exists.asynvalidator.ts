import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {PhoneNumberCodes} from '../../models/phone-number-codes-model';
import {PhoneNumberModel} from '../../models/phone-number-model';
import {ResponseModel} from '../../models/response-model';

export function PhoneNumberExistsAsynValidator(phoneNumberVerificationService: PhoneNumberVerificationService,
                                               controlName: string): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

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

    const phoneNumberModel = new PhoneNumberModel();
    phoneNumberModel.code = phoneNumberCode.internationalPhoneNumber;
    phoneNumberModel.phoneNumber = phoneNumberCode.internationalPhoneNumber + control.value;
    phoneNumberModel.alpha2 = phoneNumberCode.alpha2;
    phoneNumberModel.alpha3 = phoneNumberCode.alpha3;
    phoneNumberModel.internationalPhoneNumber = phoneNumberCode.internationalPhoneNumber;
    return phoneNumberVerificationService.doesPhoneNumberAlreadyExist(phoneNumberModel).pipe(
      map(
        (data) => {
          const responseModel: ResponseModel = data;
          if (responseModel.success) {
            return;
          } else {
            return {phoneNumberNotFound: true};
          }
        },
        (error) => {
          return;
        }
      ));
  };
}
