import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDashboardBodyComponent } from './patient-dashboard-body.component';

describe('PatientDashboardBodyComponent', () => {
  let component: PatientDashboardBodyComponent;
  let fixture: ComponentFixture<PatientDashboardBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDashboardBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDashboardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
