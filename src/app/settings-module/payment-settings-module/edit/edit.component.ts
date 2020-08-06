import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PaymentMethodModel} from '../../../payment-module/model/payment-method-model';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {PaymentMethodsService} from '../../../payment-module/service/payment-methods-service';
import {ResponseModel} from '../../../models/response-model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  paymentFormGroup: FormGroup;
  loading = true;
  checkingRequest = false;
  id: string;

  constructor(private route: ActivatedRoute,
              private paymentMethodService: PaymentMethodsService,
              private fb: FormBuilder,
              private toastrService: ToastrService) {}

  ngOnInit() {
    this.setUpPaymentForm();
    this.id = this.route.snapshot.paramMap.get('id');
    this.paymentMethodService.getOnePaymentMethods(this.id).subscribe(data => {
      const responseModel: ResponseModel = data;
      const paymentModel: PaymentMethodModel = responseModel.data;
      this.paymentFormGroup.patchValue({
        testingVerifyUrl: paymentModel.testingVerifyUrl,
        testingSecret: paymentModel.testingSecret,
        testingPublicKey: paymentModel.testingPublicKey,
        liveVerifyUrl: paymentModel.liveVerifyUrl,
        liveSecret: paymentModel.liveSecret,
        livePublicKey: paymentModel.livePublicKey,
        liveActive: paymentModel.liveActive,
        live: paymentModel.live,
        enabled: paymentModel.enabled
      });

      this.loading = false;
    }, error1 => {
    });
  }

  setUpPaymentForm() {

    this.paymentFormGroup = this.fb.group({
      testingVerifyUrl: new FormControl('', []),
      testingSecret: new FormControl('', []),
      testingPublicKey: new FormControl('', []),
      liveVerifyUrl: new FormControl('', []),
      liveSecret: new FormControl('', []),
      livePublicKey: new FormControl('', []),
      liveActive: new FormControl('', []),
      live: new FormControl('', []),
      enabled: new FormControl('', [])
    });
  }
  doUpdatePaymentMethod() {
    this.paymentMethodService.editPaymentMethod(this.paymentFormGroup.getRawValue(), this.id).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {});
  }


  showSuccess(message: string) {
    this.toastrService.success(message, 'Success!');
  }


  showFailed(message: string) {
    this.toastrService.error(message, 'Error!');
  }

}
