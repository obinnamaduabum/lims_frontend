import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientResultViewComponent } from './patient-result-view.component';

describe('PatientResultViewComponent', () => {
  let component: PatientResultViewComponent;
  let fixture: ComponentFixture<PatientResultViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientResultViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
