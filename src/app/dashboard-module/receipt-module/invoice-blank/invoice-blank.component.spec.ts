import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBlankComponent } from './invoice-blank.component';

describe('InvoiceBlankComponent', () => {
  let component: InvoiceBlankComponent;
  let fixture: ComponentFixture<InvoiceBlankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBlankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
