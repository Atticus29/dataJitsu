import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTournamentNameDialogComponent } from './new-tournament-name-dialog.component';

describe('NewTournamentNameDialogComponent', () => {
  let component: NewTournamentNameDialogComponent;
  let fixture: ComponentFixture<NewTournamentNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTournamentNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTournamentNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
