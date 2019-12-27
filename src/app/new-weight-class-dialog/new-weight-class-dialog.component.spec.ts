import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWeightClassDialogComponent } from './new-weight-class-dialog.component';

describe('NewWeightClassDialogComponent', () => {
  let component: NewWeightClassDialogComponent;
  let fixture: ComponentFixture<NewWeightClassDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWeightClassDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWeightClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
