import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLabtestTemplateComponent } from './view-all-labtest-template.component';

describe('ViewAllLabtestTemplateComponent', () => {
  let component: ViewAllLabtestTemplateComponent;
  let fixture: ComponentFixture<ViewAllLabtestTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllLabtestTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllLabtestTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
