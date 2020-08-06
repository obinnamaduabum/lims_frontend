import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLabtestTemplateComponent } from './create-labtest-template/create-labtest-template.component';
import { ViewAllLabtestTemplateComponent } from './view-all-labtest-template/view-all-labtest-template.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {LabLoggedInGuardCanActivateChild} from '../../guards/labs/lab-logged-in-can-activate-child';
import {EditLabTestTemplateComponent} from './edit-lab-test-template/edit-lab-test-template.component';
import {AssignLabTestTemplateToLabTestComponent} from './assign-lab-test-template-to-lab-test/assign-lab-test-template-to-lab-test.component';
import {JsonEditorComponent} from './json-editor/json-editor.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDividerModule} from '@angular/material/divider';
import {BeautifyJsonPipe} from '../../pipe/beautify-json-pipe';
import { NgJsonEditorModule } from 'ang-jsoneditor';


const app = [
  { path: '', component: ViewAllLabtestTemplateComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] },
  { path: 'create', component: CreateLabtestTemplateComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] },
  { path: 'edit/:code', component: EditLabTestTemplateComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] },
  { path: 'assign/:code', component: AssignLabTestTemplateToLabTestComponent, canActivateChild: [LabLoggedInGuardCanActivateChild] }
  ];

@NgModule({
  declarations: [CreateLabtestTemplateComponent,
    ViewAllLabtestTemplateComponent,
    JsonEditorComponent,
    EditLabTestTemplateComponent,
    AssignLabTestTemplateToLabTestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    SharedModuleModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    NgJsonEditorModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  providers: [BeautifyJsonPipe]
})
export class LabtestResultTemplateModule { }
