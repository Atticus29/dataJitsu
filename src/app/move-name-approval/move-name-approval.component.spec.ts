import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveNameApprovalComponent } from './move-name-approval.component';

describe('MoveNameApprovalComponent', () => {
  let component: MoveNameApprovalComponent;
  let fixture: ComponentFixture<MoveNameApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveNameApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveNameApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
