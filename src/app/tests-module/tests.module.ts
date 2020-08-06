import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestsPageComponent} from './tests-page/tests-page.component';
import {TestsBodyComponent} from './tests-body/tests-body.component';
import {RouterModule} from '@angular/router';
// import {AlreadyLoggedInGuardCanActivateChild} from '../guards/already-logged-in-can-activate-child';
import {CartPageComponent} from './cart-page/cart-page.component';
import {MenuItemsModule} from '../menu-items-module/menu-items-module.module';
import {LottieAnimationViewModule} from 'ng-lottie';
import {ReactiveFormsModule} from '@angular/forms';
import {EditPhoneNumberDialogueModule} from '../edit-phone-number-dialogue/edit-phone-number-dialogue.module';
import {AddPatientNameDialogComponent} from './add-patient-name-dialog/add-patient-name-dialog.component';
import { CartForInstitutionPageComponent } from './cart-for-institution-page/cart-for-institution-page.component';
import { EditPatientNameDialogComponent } from './edit-patient-name-dialog/edit-patient-name-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AlreadyLoggedInGuardCanActivateChild} from '../guards/already-logged-in-can-activate-child';
import {HeaderModule} from '../header-module/header-module.module';
import {FooterModule} from '../footer-module/footer-module.module';

const app = [
  {
    path: '', component: TestsBodyComponent, canActivateChild: [AlreadyLoggedInGuardCanActivateChild], children: [
      {path: '', component: TestsPageComponent},
      {path: 'cart', component: CartPageComponent}
    ]
  },
];

@NgModule({
  declarations: [TestsPageComponent,
    TestsBodyComponent,
    CartPageComponent,
    AddPatientNameDialogComponent,
    CartForInstitutionPageComponent,
    EditPatientNameDialogComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatMenuModule,
    MenuItemsModule,
    LottieAnimationViewModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    EditPhoneNumberDialogueModule,
    RouterModule.forChild(app),
    MatPaginatorModule,
    MatAutocompleteModule,
    HeaderModule,
    FooterModule
  ],
  exports: [CartPageComponent,
    TestsPageComponent,
    AddPatientNameDialogComponent,
    CartForInstitutionPageComponent],
  entryComponents: [AddPatientNameDialogComponent,
    EditPatientNameDialogComponent]
})
export class TestsModule {
}
