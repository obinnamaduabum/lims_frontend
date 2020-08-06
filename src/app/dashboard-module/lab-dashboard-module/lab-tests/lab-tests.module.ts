import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLabTestComponent } from './create-lab-test/create-lab-test.component';
import { EditLabTestComponent } from './edit-lab-test/edit-lab-test.component';
import { ViewAllLabTestComponent } from './view-all-lab-test/view-all-lab-test.component';
import {RouterModule} from '@angular/router';
import { UploadLabTestsComponent } from './upload-lab-tests/upload-lab-tests.component';
import {MatCardModule} from '@angular/material/card';



const app = [
  { path: '', redirectTo: 'create-test', pathMatch: 'full'},
  { path: 'create-test', component: CreateLabTestComponent},
  { path: 'upload-test', component: UploadLabTestsComponent}
];

@NgModule({
  declarations: [CreateLabTestComponent,
    EditLabTestComponent,
    ViewAllLabTestComponent,
    UploadLabTestsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(app)
  ]
})
export class LabTestsModule { }
