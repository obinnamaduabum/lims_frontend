import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandPageBodyComponent } from './land-page-body.component';

describe('LandPageBodyComponent', () => {
  let component: LandPageBodyComponent;
  let fixture: ComponentFixture<LandPageBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandPageBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
