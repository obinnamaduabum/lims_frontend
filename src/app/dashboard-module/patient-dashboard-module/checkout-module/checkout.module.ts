import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import {RouterModule} from '@angular/router';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {TestsModule} from '../../../tests-module/tests.module';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {PaymentModule} from '../../../payment-module/payment.module';


const app = [
  { path: '', redirect: '/view', pathMatch: 'full' },
  { path: 'view', component: CheckoutPageComponent },
  { path: 'payment', component: CheckoutPaymentComponent },
];

@NgModule({
  declarations: [
    CheckoutPageComponent,
    CheckoutPaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    MatCardModule,
    TestsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    PaymentModule,
  ]
})
export class CheckoutModule { }
