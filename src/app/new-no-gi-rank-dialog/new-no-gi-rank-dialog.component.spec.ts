import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNoGiRankDialogComponent } from './new-no-gi-rank-dialog.component';

describe('NewNoGiRankDialogComponent', () => {
  let component: NewNoGiRankDialogComponent;
  let fixture: ComponentFixture<NewNoGiRankDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNoGiRankDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNoGiRankDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
