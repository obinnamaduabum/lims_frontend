import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  accountSettingsFormGroup: FormGroup;
  constructor(private fb: FormBuilder,
              private toastrService: ToastrService) { }

  ngOnInit() {

    this.accountSettingsFormGroup = this.fb.group({
      emailEnabled: ['', []],
      smsEnabled: ['', []],
    });
    this.accountSettingsFormGroup.patchValue({
      emailEnabled: false,
      smsEnabled: false
    });
    this.accountSettingsFormGroup.get('emailEnabled').valueChanges.subscribe(data => {
      this.showSuccess('Settings Updated');
    });
    this.accountSettingsFormGroup.get('smsEnabled').valueChanges.subscribe(data => {
      this.showSuccess('Settings Updated');
    });
  }
  showSuccess(message: string) {
    this.toastrService.success(message, 'Success');
  }
  showFailed(message: string) {
    this.toastrService.error(message, 'Success');
  }

}
