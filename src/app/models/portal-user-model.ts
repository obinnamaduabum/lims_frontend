import {PortalAccountDescriptionModel} from './portal-account-description-model';

export class PortalUserModel {

  password: string;
  username: string;
  authorities: any;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  id: number;
  lastName: string;
  firstName: string;
  otherName: string;
  phoneNumber: string;
  email: string;
  roles: any;
  profileImage: string;
  backgroundProfileImage: string;
  otherPhoneNumber: string;
  signUpType: string;
  countryId: string;
  portalAccountId = '';
  courseCode: string;
  dob: Date;
  isPhoneNumberVerified: boolean;
  defaultProfileTypeConstant: string;
  passwordStrength: string;
  portalAccountDescriptionDtoList: PortalAccountDescriptionModel[];
  defaultPortalAccountCode: string;
  phoneNumberObj: any;
  otherPhoneNumberObj: any;
  code: any;
  accountBlockedByAdmin: boolean;
}
