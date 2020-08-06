import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLabTestComponent } from './view-all-lab-test.component';

describe('ViewAllLabTestComponent', () => {
  let component: ViewAllLabTestComponent;
  let fixture: ComponentFixture<ViewAllLabTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllLabTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
