import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLabTestsComponent } from './upload-lab-tests.component';

describe('UploadLabTestsComponent', () => {
  let component: UploadLabTestsComponent;
  let fixture: ComponentFixture<UploadLabTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadLabTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
