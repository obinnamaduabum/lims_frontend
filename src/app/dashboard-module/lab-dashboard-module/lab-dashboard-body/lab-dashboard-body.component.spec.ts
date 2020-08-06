import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDashboardBodyComponent } from './lab-dashboard-body.component';

describe('LabDashboardBodyComponent', () => {
  let component: LabDashboardBodyComponent;
  let fixture: ComponentFixture<LabDashboardBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDashboardBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDashboardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
