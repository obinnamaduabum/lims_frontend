import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientResultComponent } from './edit-patient-result.component';

describe('EditPatientResultComponent', () => {
  let component: EditPatientResultComponent;
  let fixture: ComponentFixture<EditPatientResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPatientResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
