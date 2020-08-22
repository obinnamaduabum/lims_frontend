import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientResultListComponent } from './patient-result-list.component';

describe('PatientResultListComponent', () => {
  let component: PatientResultListComponent;
  let fixture: ComponentFixture<PatientResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
