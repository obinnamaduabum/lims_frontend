import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabTestTemplateComponent } from './edit-lab-test-template.component';

describe('EditLabTestTemplateComponent', () => {
  let component: EditLabTestTemplateComponent;
  let fixture: ComponentFixture<EditLabTestTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLabTestTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabTestTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
