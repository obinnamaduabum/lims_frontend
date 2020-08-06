import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLabtestTemplateComponent } from './create-labtest-template.component';

describe('CreateLabtestTemplateComponent', () => {
  let component: CreateLabtestTemplateComponent;
  let fixture: ComponentFixture<CreateLabtestTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLabtestTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLabtestTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
