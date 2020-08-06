import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLabTestTemplateToLabTestComponent } from './assign-lab-test-template-to-lab-test.component';

describe('AssignLabTestTemplateToLabTestComponent', () => {
  let component: AssignLabTestTemplateToLabTestComponent;
  let fixture: ComponentFixture<AssignLabTestTemplateToLabTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignLabTestTemplateToLabTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLabTestTemplateToLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
