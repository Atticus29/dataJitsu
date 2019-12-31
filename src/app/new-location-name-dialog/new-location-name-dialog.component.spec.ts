import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLocationNameDialogComponent } from './new-location-name-dialog.component';

describe('NewLocationNameDialogComponent', () => {
  let component: NewLocationNameDialogComponent;
  let fixture: ComponentFixture<NewLocationNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLocationNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLocationNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
