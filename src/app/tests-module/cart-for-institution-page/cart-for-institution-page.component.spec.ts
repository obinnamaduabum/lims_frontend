import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartForInstitutionPageComponent } from './cart-for-institution-page.component';

describe('CartForInstitutionPageComponent', () => {
  let component: CartForInstitutionPageComponent;
  let fixture: ComponentFixture<CartForInstitutionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartForInstitutionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartForInstitutionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
