import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteNameApprovalComponent } from './athlete-name-approval.component';

describe('AthleteNameApprovalComponent', () => {
  let component: AthleteNameApprovalComponent;
  let fixture: ComponentFixture<AthleteNameApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteNameApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteNameApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
