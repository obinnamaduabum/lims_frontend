import {Injectable} from '@angular/core';
import {Router, CanLoad, Route, UrlSegment} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {PortalAccountTypeConstant} from '../../lh-enum/portal-account-type';
import {AuthenticationService} from '../../service/authentication-service';
import {ResponseModel} from '../../models/response-model';
import {PortalUserModel} from '../../models/portal-user-model';


@Injectable()
export class LoggedInPatientCanLoadGuard implements CanLoad {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authenticationService.checkIfUserIsAlreadyLoggedIn().pipe(map(data => {
      const responseModel: ResponseModel = data;
      if (responseModel) {
        const portalUser: PortalUserModel = responseModel.data;
        const result = this.checkPortalAccountType(portalUser);
        if (result.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
          return false;
        } else if (result.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
          return true;
        }
        return false;
      }
      return false;
    }), catchError((error, caught) => {
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
