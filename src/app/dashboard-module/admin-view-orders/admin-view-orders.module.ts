import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewAllOrdersComponent} from './view-all-orders/view-all-orders.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {UpdateOrderComponent} from './update-order/update-order.component';
import {SampleCollectedByDialogComponent} from './sample-collected-by-dialog/sample-collected-by-dialog.component';
import {ViewAllLabTestsOrderedComponent} from './view-all-lab-tests-ordered/view-all-lab-tests-ordered.component';
import {PrintLayoutComponent} from '../../shared-module/print-layout/print-layout.component';
import {InvoiceComponent} from '../../shared-module/invoice/invoice.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const app = [
  { path: '', component: ViewAllOrdersComponent },
  { path: 'lab-tests-ordered', component: ViewAllLabTestsOrderedComponent },
  { path: ':id', component: UpdateOrderComponent,
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
    ViewAllOrdersComponent,
    UpdateOrderComponent,
    SampleCollectedByDialogComponent,
    ViewAllLabTestsOrderedComponent],
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
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [SampleCollectedByDialogComponent]
})
export class AdminViewOrdersModule {
}
