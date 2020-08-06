import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleCollectedByDialogComponent } from './sample-collected-by-dialog.component';

describe('SampleCollectedByDialogComponent', () => {
  let component: SampleCollectedByDialogComponent;
  let fixture: ComponentFixture<SampleCollectedByDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleCollectedByDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleCollectedByDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
