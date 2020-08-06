import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsBodyComponent } from './tests-body.component';

describe('TestsBodyComponent', () => {
  let component: TestsBodyComponent;
  let fixture: ComponentFixture<TestsBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
