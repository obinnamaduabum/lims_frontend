import {Component, Inject, OnInit} from '@angular/core';
import {PhoneNumberCodes} from '../models/phone-number-codes-model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PhoneNumberCodeService} from '../service/phone_number_service';


// tslint:disable-next-line:no-empty-interface
interface DialogData {
}

@Component({
  selector: 'app-phone-number-dialog',
  templateUrl: 'app-phone-number-dialog.html',
})
export class PhoneNumberDialogComponent implements OnInit {

  phoneNumberCodes: PhoneNumberCodes[] = [];
  listPhoneNumberCodes: PhoneNumberCodes[] = [];
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';

  constructor(public dialogRef: MatDialogRef<PhoneNumberDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private phoneNumberCodeService: PhoneNumberCodeService) {}


  ngOnInit() {
    this.getPhoneNumberCodes();
  }
  getPhoneNumberCodes() {
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {
      this.listPhoneNumberCodes = data;
      this.phoneNumberCodes = this.listPhoneNumberCodes;
    }, error1 => {});
  }


  getLocalCountryImageUrl(b: string) {
    return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
  }


  findCountries(countryName: string) {
    this.listPhoneNumberCodes = this.phoneNumberCodes.filter(restaurant =>
      restaurant.name.toLowerCase().includes(countryName.toLocaleLowerCase()));
  }

}
