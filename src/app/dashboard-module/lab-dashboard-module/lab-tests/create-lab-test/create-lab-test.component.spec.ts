import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLabTestComponent } from './create-lab-test.component';

describe('CreateLabTestComponent', () => {
  let component: CreateLabTestComponent;
  let fixture: ComponentFixture<CreateLabTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLabTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
