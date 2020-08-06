import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../service/user.service';
import {ResponseModel} from '../../models/response-model';

export function EmailNotAlreadyTakenValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

    if (!control.parent || !control) {
      return;
    }

    if (control.pristine) {
      return of( null );
    }

    return userService.checkIfUserEmailExists(control.value).pipe(
        map(
          (data) => {
            const responseModel: ResponseModel = data;
            // console.log(responseModel);
            if (responseModel.success) {
              return {emailAlreadyTaken: true};
            } else {
              return;
            }
          },
          (error) => {
            return;
          }
        ));
  };
}
