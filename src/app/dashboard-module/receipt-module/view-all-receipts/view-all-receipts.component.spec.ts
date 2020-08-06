import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllReceiptsComponent } from './view-all-receipts.component';

describe('ViewAllReceiptsComponent', () => {
  let component: ViewAllReceiptsComponent;
  let fixture: ComponentFixture<ViewAllReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
