import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSampleCollectionStackComponent } from './view-sample-collection-stack.component';

describe('ViewSampleCollectionStackComponent', () => {
  let component: ViewSampleCollectionStackComponent;
  let fixture: ComponentFixture<ViewSampleCollectionStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSampleCollectionStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSampleCollectionStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
