import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMoveDialogComponent } from './new-move-dialog.component';

describe('NewMoveDialogComponent', () => {
  let component: NewMoveDialogComponent;
  let fixture: ComponentFixture<NewMoveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMoveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
