import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../service/user.service';
import {ResponseModel} from '../../models/response-model';

export function DoesEmailExistValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

    if (!control.parent || !control) {
      return;
    }

    return userService.checkIfUserEmailExists(control.value).pipe(
      map(
        (data) => {
          const responseModel: ResponseModel = data;
          if (responseModel.success) {
            return;
          } else {
            return {emailDoesNotExist: true};
          }
        },
        (error) => {
          return;
        }
      ));
  };
}
