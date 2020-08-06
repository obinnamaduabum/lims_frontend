import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { MainSettingComponent } from './main-setting/main-setting.component';

import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';



const app = [
  { path: 'main', component: MainSettingComponent },
  { path: 'payment',
    loadChildren: () =>
      import('src/app/settings-module/payment-settings-module/payment-settings.module').then(m => m.PaymentSettingsModule)},
];

@NgModule({
  declarations: [MainSettingComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule.forChild(app)
  ]
})
export class SettingsModule { }
