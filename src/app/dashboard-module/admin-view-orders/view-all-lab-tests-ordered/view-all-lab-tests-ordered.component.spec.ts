import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLabTestsOrderedComponent } from './view-all-lab-tests-ordered.component';

describe('ViewAllLabTestsOrderedComponent', () => {
  let component: ViewAllLabTestsOrderedComponent;
  let fixture: ComponentFixture<ViewAllLabTestsOrderedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllLabTestsOrderedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllLabTestsOrderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
