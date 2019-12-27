import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightClassNameApprovalComponent } from './weight-class-name-approval.component';

describe('WeightClassNameApprovalComponent', () => {
  let component: WeightClassNameApprovalComponent;
  let fixture: ComponentFixture<WeightClassNameApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightClassNameApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightClassNameApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
