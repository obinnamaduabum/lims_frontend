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

export function AsyncTwoFactorCodeVerificationValidator(userService: UserService,
                                                        loginInfoService: LoginInfoService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

    if (!control.parent || !control) {
      return;
    }

    let loginInfoModel: LoginInfoModel = new LoginInfoModel();
    loginInfoService.getLoginInfo().subscribe(data => {
      loginInfoModel = data;
    });

    const code: string = control.value;
    if (code.length >= 6) {

      const inputData = {
        email: loginInfoModel.email,
        twoFactorCode: code
      };

      return userService.verifyTwoFactorCode(inputData).pipe(
        map(
          (data) => {
            const responseModel: ResponseModel = data;
            console.log(responseModel);
            if (responseModel.success) {
              return;
            } else {
              return {codeInValid: true};
            }
          },
          (error) => {
            return {codeInValid: true};
          }
        ));
    } else {
      return of(null);
    }
  };
}

