import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabDashboardComponent} from './lab-dashboard/lab-dashboard.component';
import {RouterModule} from '@angular/router';
import {LabHeaderComponent} from './lab-header/lab-header.component';
import {LabSidebarComponent} from './lab-sidebar/lab-sidebar.component';
import {LabDashboardBodyComponent} from './lab-dashboard-body/lab-dashboard-body.component';
import {LabLoggedInGuardCanActivateChild} from '../../guards/labs/lab-logged-in-can-activate-child';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MenuItemsModule} from '../../menu-items-module/menu-items-module.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {TimeagoModule} from 'ngx-timeago';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {HeaderModule} from '../../header-module/header-module.module';
import {FooterModule} from '../../footer-module/footer-module.module';
import {ChartsModule} from 'ng2-charts';

const app = [
  {
    path: '', component: LabDashboardBodyComponent, canActivateChild: [LabLoggedInGuardCanActivateChild], children: [
      {path: '', component: LabDashboardComponent},
      {
        path: 'lab-tests',
        loadChildren: () => import('src/app/dashboard-module/lab-dashboard-module/lab-tests/lab-tests.module').then(m => m.LabTestsModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('src/app/dashboard-module/admin-view-orders/admin-view-orders.module').then(m => m.AdminViewOrdersModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('src/app/settings-module/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'edit',
        loadChildren: () =>
          import('src/app/dashboard-module/account-management-module/account-management-module').then(m => m.AccountManagementModule)
      },
      // {
      //   path: 'notifications',
      //   loadChildren: () =>
      //     import('src/app/notification-page-module/notification-page-module.module').then(m => m.NotificationPageModule)
      // },
      { path: 'manage-users',
        loadChildren: () =>
          import('src/app/dashboard-module/manage-users/manage-users.module').then(m => m.ManageUsersModule)
      },
      { path: 'lab-test-template',
        loadChildren: () =>
          import('src/app/dashboard-module/labtest-result-template/labtest-result-template.module')
          .then(m => m.LabtestResultTemplateModule)
      },
      { path: 'medical-lab-scientist',
        loadChildren: () =>
          import('src/app/dashboard-module/medical-lab-scientist/medical-lab-scientist.module')
          .then(m => m.MedicalLabScientistModule)
      }
    ]
  },
];

@NgModule({
  declarations: [
    LabDashboardComponent,
    LabHeaderComponent,
    LabSidebarComponent,
    LabDashboardBodyComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    TimeagoModule,
    RouterModule.forChild(app),
    MatSidenavModule,
    MatCardModule,
    MatMenuModule,
    MenuItemsModule,
    MatIconModule,
    ChartsModule,
    HeaderModule,
    FooterModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ]
})
export class LabDashboardModule {
}
