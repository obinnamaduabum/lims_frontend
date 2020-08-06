import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalComponent } from './paypal.component';

@NgModule({
  declarations: [PaypalComponent],
  imports: [
    CommonModule
  ], exports: [PaypalComponent]
})
export class PayPalModule { }
