import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {PortalAccountTypeConstant} from '../../lh-enum/portal-account-type';
import {AuthenticationService} from '../../service/authentication-service';
import {ResponseModel} from '../../models/response-model';
import {PortalUserModel} from '../../models/portal-user-model';


@Injectable()
export class LabLoggedInGuard implements CanActivate {

    constructor(private router: Router,
                private authenticationService: AuthenticationService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authenticationService.checkIfUserIsAlreadyLoggedIn().pipe(map(data => {
      const responseModel: ResponseModel = data;

      //  console.log(data);
      if (data) {
        const portalUser: PortalUserModel = responseModel.data;
        // console.log(portalUser);
        const result = this.checkPortalAccountType(portalUser);
        if (result.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
          //  console.log('labs');
          return true;
        } else if (result.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
          this.router.navigate(['/dashboard/patient']);
          return true;
        }
      }
      this.router.navigate(['/login']);
      return false;
    }), catchError((error, caught) => {
      this.router.navigate(['/login']);
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






