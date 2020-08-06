import {ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {UserService} from '../../service/user.service';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {LoginInfoService} from '../../service/login-info.service';
import {PhoneNumberCodes} from '../../models/phone-number-codes-model';
import {PhoneNumberModel} from '../../models/phone-number-model';
import {LoginInfoModel} from '../../models/login-info-model';
import {ResponseModel} from '../../models/response-model';

export function AsyncPhoneNumberAndEmailValidator(userService: UserService,
                                                  phoneNumberVerificationService: PhoneNumberVerificationService,
                                                  loginInfoService: LoginInfoService,
                                                  controlName: string): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

    const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneNumberRegex = /^\+?\d+$/;
    const alphabetRegex = /^[a-zA-Z]+$/;
    const phoneNumberValidationRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;


    if (!control.parent || !control) {
      return;
    }

    if (phoneNumberValidationRegex.test(control.value)) {
      // if (control.value.toString().length > 4) {
      //   console.log('i ran');
      // control.parent.get('nextOfKinSelectedPhoneNumber').value;
      let phoneNumberCode: PhoneNumberCodes;
      if (controlName === 'nextOfKinPhoneNumber') {
        phoneNumberCode = control.parent.get('nextOfKinSelectedPhoneNumber').value;
      } else if (controlName === 'phoneNumber') {
        phoneNumberCode = control.parent.get('selectedPhoneNumber').value;
      } else if (controlName === 'otherPhoneNumber') {
        phoneNumberCode = control.parent.get('selectedOtherPhoneNumber').value;
      }


      const phoneNumberModel: PhoneNumberModel = new PhoneNumberModel();
      phoneNumberModel.phoneNumber = control.value;
      phoneNumberModel.alpha2 = phoneNumberCode.alpha2;
      phoneNumberModel.alpha3 = phoneNumberCode.alpha3;
      phoneNumberModel.internationalPhoneNumber = phoneNumberCode.internationalPhoneNumber;
      return phoneNumberVerificationService.doesPhoneNumberAlreadyExist(phoneNumberModel).pipe(
        map(
          (data) => {
            const responseModel: ResponseModel = data;
            console.log(responseModel);
            if (responseModel.success) {
              const loginInfoModel: LoginInfoModel = new LoginInfoModel();
              loginInfoModel.phoneNumberModelCodes = phoneNumberModel;
              // console.log(responseModel.data.formattedNumber);
              loginInfoModel.email = responseModel.data.formattedNumber;
              console.log(responseModel.data.twoFactor);
              loginInfoModel.twoFactorEnabled = responseModel.data.twoFactor;
              loginInfoService.setLoginInfo(null);
              loginInfoService.setLoginInfo(loginInfoModel);
              return;
            } else {
              return {phoneNumberDoesNotExist: true};
            }
          },
          (error) => {
            return {phoneNumberDoesNotExist: true};
          }
        ));
      // }

      // return of(null);
    } else if (emailFormat.test(control.value)) {
      return userService.checkIfUserEmailExists(control.value).pipe(
        map(
          (data) => {
            const responseModel: ResponseModel = data;
            console.log(responseModel);
            if (responseModel.success) {
              const loginInfoModel: LoginInfoModel = new LoginInfoModel();
              loginInfoModel.phoneNumberModelCodes = null;
              loginInfoModel.email = control.value;
              console.log(responseModel.data.twoFactor);
              loginInfoModel.twoFactorEnabled = responseModel.data.twoFactor;
              loginInfoService.setLoginInfo(loginInfoModel);
              return;
            } else {
              return {emailDoesNotExist: true};
            }
          },
          (error) => {
            return {emailDoesNotExist: true};
          }
        ));
    } else {
      return of(null);
    }
  };
}

