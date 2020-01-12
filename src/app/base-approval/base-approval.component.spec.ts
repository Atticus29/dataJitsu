import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseApprovalComponent } from './base-approval.component';

describe('BaseApprovalComponent', () => {
  let component: BaseApprovalComponent;
  let fixture: ComponentFixture<BaseApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
