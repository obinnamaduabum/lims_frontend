import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessfulWithStepsComponent } from './registration-successful-with-steps.component';

describe('RegistrationSuccessfulWithStepsComponent', () => {
  let component: RegistrationSuccessfulWithStepsComponent;
  let fixture: ComponentFixture<RegistrationSuccessfulWithStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationSuccessfulWithStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessfulWithStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
