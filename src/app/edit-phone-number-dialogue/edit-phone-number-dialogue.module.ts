import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PhoneNumberDialogComponent} from './edit-phone-number-dialogue-component';
import {SharedModuleModule} from '../shared-module/shared-module.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [PhoneNumberDialogComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  entryComponents: [PhoneNumberDialogComponent],
  exports: [PhoneNumberDialogComponent]
})
export class EditPhoneNumberDialogueModule { }
