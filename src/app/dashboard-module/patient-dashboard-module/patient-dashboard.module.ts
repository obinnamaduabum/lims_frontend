import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDashboardComponent } from './patient-dashboard-body/patient-dashboard/patient-dashboard.component';
import {RouterModule} from '@angular/router';
import { PatientSidebarComponent } from './patient-sidebar/patient-sidebar.component';
import { PatientHeaderComponent } from './patient-header/patient-header.component';
import { PatientDashboardBodyComponent } from './patient-dashboard-body/patient-dashboard-body.component';
import { MyTestsComponent } from './my-tests/my-tests.component';
import {TimeagoModule} from 'ngx-timeago';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {PatientLoggedInGuardCanActivateChild} from '../../guards/patient/patient-logged-in-can-activate-child';
import {TestsPageComponent} from '../../tests-module/tests-page/tests-page.component';
import {MenuItemsModule} from '../../menu-items-module/menu-items-module.module';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {TestsModule} from '../../tests-module/tests.module';
import {FooterModule} from '../../footer-module/footer-module.module';

const app = [
  { path: '', component: PatientDashboardBodyComponent, canActivateChild: [PatientLoggedInGuardCanActivateChild], children: [
      { path: 'main', component: PatientDashboardComponent },
      { path: 'tests', component: TestsPageComponent },
      { path: 'receipt', loadChildren: () => import('src/app/dashboard-module/receipt-module/receipt-module').then(m => m.ReceiptModule)},
      { path: 'check-out',
        loadChildren: () =>
          import('src/app/dashboard-module/patient-dashboard-module/checkout-module/checkout.module').then(m => m.CheckoutModule)},
      { path: 'edit',
        loadChildren: () =>
          import('src/app/dashboard-module/account-management-module/account-management-module').then(m => m.AccountManagementModule)}
    ]},
];

@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientSidebarComponent,
    PatientHeaderComponent,
    PatientDashboardBodyComponent,
    MyTestsComponent],
  imports: [
    CommonModule,
    TimeagoModule,
    RouterModule.forChild(app),
    MatSidenavModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MenuItemsModule,
    SharedModuleModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TestsModule,
    FooterModule
  ]
})
export class PatientDashboardModule { }
