import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TruncatePipe} from '../pipe/truncate-pipe';
import {DateAgoPipe} from '../pipe/date-ago-pipe';
import {UdpCurrencyMaskPipe} from '../pipe/udp-currency-mask-pipe';
import {InvoiceComponent} from './invoice/invoice.component';
import {PrintLayoutComponent} from './print-layout/print-layout.component';
import {RouterModule} from '@angular/router';
import {BeautifyJsonPipe} from '../pipe/beautify-json-pipe';
import {MatDividerModule} from '@angular/material/divider';
import {TimeagoModule} from 'ngx-timeago';

@NgModule({
  declarations: [
    TruncatePipe,
    DateAgoPipe,
    UdpCurrencyMaskPipe,
    BeautifyJsonPipe,
    PrintLayoutComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    RouterModule
  ],
  exports: [
    TimeagoModule,
    TruncatePipe,
    DateAgoPipe,
    UdpCurrencyMaskPipe,
    BeautifyJsonPipe,
    PrintLayoutComponent,
    InvoiceComponent]
})
export class SharedModuleModule { }
