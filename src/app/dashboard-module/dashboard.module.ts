import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

const app = [
  { path: 'patient',
    loadChildren: () => import('src/app/dashboard-module/patient-dashboard-module/patient-dashboard.module')
      .then(m => m.PatientDashboardModule) },

  { path: 'lab',
    loadChildren: () => import('src/app/dashboard-module/lab-dashboard-module/lab-dashboard.module')
      .then(m => m.LabDashboardModule)}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(app)
  ]
})
export class DashboardModule { }
