import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientNameDialogComponent } from './edit-patient-name-dialog.component';

describe('EditPatientNameDialogComponent', () => {
  let component: EditPatientNameDialogComponent;
  let fixture: ComponentFixture<EditPatientNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPatientNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
