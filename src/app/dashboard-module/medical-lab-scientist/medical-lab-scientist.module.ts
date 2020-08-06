import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientResultComponent } from './patient-result/patient-result.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import { ViewSampleCollectionStackComponent } from './view-sample-collection-stack/view-sample-collection-stack.component';
import { EditPatientResultComponent } from './edit-patient-result/edit-patient-result.component';
import {LabLoggedInGuardCanActivateChild} from '../../guards/labs/lab-logged-in-can-activate-child';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';


const app = [
  { path: '', component: PatientResultComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] },
  { path: 'patient-result/:id', component: PatientResultComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] },
  { path: 'patient-result/edit/:id', component: EditPatientResultComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] },
  { path: 'tasks', component: ViewSampleCollectionStackComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] }
];

@NgModule({
  declarations: [PatientResultComponent, ViewSampleCollectionStackComponent, EditPatientResultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatNativeDateModule
  ],
  providers: [MatDatepickerModule]
})
export class MedicalLabScientistModule { }
