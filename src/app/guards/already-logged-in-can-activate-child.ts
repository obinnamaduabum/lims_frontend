import {Injectable} from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route,
  CanActivateChild
} from '@angular/router';
import {PortalAccountTypeConstant} from '../lh-enum/portal-account-type';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ResponseModel} from '../models/response-model';
import {AuthenticationService} from '../service/authentication-service';
import {PortalUserModel} from '../models/portal-user-model';

@Injectable()
export class AlreadyLoggedInGuardCanActivateChild implements CanActivateChild {


  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authenticationService.checkIfUserIsAlreadyLoggedIn().pipe(map(data => {
      const responseModel: ResponseModel = data;

      //  console.log(data);
      if (data) {
        const portalUser: PortalUserModel = responseModel.data;
        // console.log(portalUser);
        const result = this.checkPortalAccountType(portalUser);


        // console.log(result);

        // const result = this.checkUserRoles(this.checkIfAdmin(portalUser));

        //  console.log(result.portalAccountTypeConstant);
        if (result.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
          //  console.log('labs');
          this.router.navigate(['/dashboard/lab']);
          // return false;
        } else if (result.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
          console.log('patient');
          this.router.navigate(['/dashboard/patient/main']);
          // return false;
        }
      } else {
        return true;
      }
    }), catchError((error, caught) => {
      return of(true);
    }));
  }


  checkPortalAccountType(portalUser: PortalUserModel) {

    let userData: any;
    const result = portalUser.portalAccountDescriptionDtoList.filter(value => {
      if (value.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
        userData = value;
      } else if (value.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
        userData = value;
      }
    });
    if (userData) {
      return userData;
    }
    return null;
  }
}
