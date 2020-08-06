import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ViewAllReceiptsComponent} from './view-all-receipts/view-all-receipts.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ViewReceiptComponent} from './view-receipt/view-receipt.component';
import {InvoiceBlankComponent} from './invoice-blank/invoice-blank.component';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {PrintLayoutComponent} from '../../shared-module/print-layout/print-layout.component';
import {InvoiceComponent} from '../../shared-module/invoice/invoice.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const app = [
  { path: '', component: ViewAllReceiptsComponent },
  { path: ':id', component: ViewReceiptComponent,
    children: [
      {
        path: 'print', outlet: 'print', component: PrintLayoutComponent,
        children: [
          {path: 'invoice/:invoiceIds', component: InvoiceComponent}
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    ViewAllReceiptsComponent,
    ViewReceiptComponent,
    InvoiceBlankComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    SharedModuleModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    DeviceDetectorModule
  ]
})
export class ReceiptModule {
}
