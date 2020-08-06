import {Injectable} from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route,
  CanActivateChild
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {PortalAccountTypeConstant} from '../../lh-enum/portal-account-type';
import {AuthenticationService} from '../../service/authentication-service';
import {ResponseModel} from '../../models/response-model';
import {PortalUserModel} from '../../models/portal-user-model';

@Injectable()
export class PatientLoggedInGuardCanActivateChild implements CanActivateChild {


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
          this.router.navigate(['/admin']);
          // return false;
        } else if (result.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
          console.log('patient');
          return true;
        }
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
    }), catchError((error, caught) => {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return of(false);
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
