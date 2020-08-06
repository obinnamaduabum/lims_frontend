import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllUsersComponent } from './view-all-users/view-all-users.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {EditPhoneNumberDialogueModule} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


const app = [
  { path: 'create-employee', component: CreateEmployeeComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'edit-employee/:id', component: EditEmployeeComponent },
  { path: 'view-all-users', component: ViewAllUsersComponent },
  { path: 'topic', component: CreateTopicComponent },
];

@NgModule({
  declarations: [ViewAllUsersComponent, EditUserComponent, CreateEmployeeComponent, CreateTopicComponent, EditEmployeeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    EditPhoneNumberDialogueModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSlideToggleModule
  ]
})
export class ManageUsersModule { }
