import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrAnnotationDetailsComponent } from './payment-or-annotation-details.component';

describe('PaymentOrAnnotationDetailsComponent', () => {
  let component: PaymentOrAnnotationDetailsComponent;
  let fixture: ComponentFixture<PaymentOrAnnotationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOrAnnotationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOrAnnotationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
