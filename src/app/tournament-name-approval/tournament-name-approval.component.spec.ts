import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentNameApprovalComponent } from './tournament-name-approval.component';

describe('TournamentNameApprovalComponent', () => {
  let component: TournamentNameApprovalComponent;
  let fixture: ComponentFixture<TournamentNameApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentNameApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentNameApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
