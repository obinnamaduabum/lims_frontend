import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PaymentMethodsService} from '../../payment-module/service/payment-methods-service';
import {ToastrService} from 'ngx-toastr';
import {AdminSettingsModel} from '../../models/admin-settings-model';
import {ResponseModel} from '../../models/response-model';
import {AdminSettingsService} from '../../service/admin-settings-service';
import {CurrencyTypeInterface} from '../../interface/currency.type';

@Component({
  selector: 'app-main-setting',
  templateUrl: './main-setting.component.html',
  styleUrls: ['./main-setting.component.css']
})
export class MainSettingComponent implements OnInit {

  adminSettingsFormGroup: FormGroup;
  loading = true;
  checkingRequest = false;
  id: string;
  adminSettingsModel: AdminSettingsModel;

  currencyTypes: CurrencyTypeInterface[] = [
    {value: 'NGN', viewValue: 'NAIRA'},
    {value: 'USD', viewValue: 'USD'},
    {value: 'EUR', viewValue: 'EURO'}
  ];

  constructor(private route: ActivatedRoute,
              private paymentMethodService: PaymentMethodsService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private adminSettingsService: AdminSettingsService) {
  }

  ngOnInit() {
    this.setAdminSettingsForm();
    this.adminSettingsService.getPublicAllAdminSettings().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.adminSettingsModel = responseModel.data;
        this.adminSettingsFormGroup.patchValue({
          dropBoxActive: this.adminSettingsModel.dropBoxActive,
          dataStorageProduction: this.adminSettingsModel.dataStorageProduction,
          currencyType: this.adminSettingsModel.currencyType
        });
        this.loading = false;
      }
    }, error1 => {
    });
  }


  setAdminSettingsForm() {
    this.adminSettingsFormGroup = this.fb.group({
      dropBoxActive: new FormControl('', []),
      dataStorageProduction: new FormControl('', []),
      currencyType: new FormControl('', [Validators.required])
    });
  }

  showSuccess(message: string) {
    this.toastrService.success(message, 'Success!');
  }


  showFailed(message: string) {
    this.toastrService.error(message, 'Error!');
  }

  doUpdatePaymentMethod() {
    this.adminSettingsService.updateAnAdminSettings(this.adminSettingsFormGroup.getRawValue()).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {

      this.showFailed(error1.error.message);
    });
  }
}
