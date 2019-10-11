import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAthleteNameDialogComponent } from './new-athlete-name-dialog.component';

describe('NewAthleteNameDialogComponent', () => {
  let component: NewAthleteNameDialogComponent;
  let fixture: ComponentFixture<NewAthleteNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAthleteNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAthleteNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
