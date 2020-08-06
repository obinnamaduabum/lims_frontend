import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientNameDialogComponent } from './add-patient-name-dialog.component';

describe('AddPatientNameDialogComponent', () => {
  let component: AddPatientNameDialogComponent;
  let fixture: ComponentFixture<AddPatientNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
