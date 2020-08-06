import {PhoneNumberModel} from './phone-number-model';

export class LoginInfoModel {
  email: string;
  phoneNumberModelCodes: PhoneNumberModel;
  twoFactorEnabled: boolean;
}
