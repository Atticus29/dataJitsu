import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgeClassDialogComponent } from './new-age-class-dialog.component';

describe('NewAgeClassDialogComponent', () => {
  let component: NewAgeClassDialogComponent;
  let fixture: ComponentFixture<NewAgeClassDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAgeClassDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAgeClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
