import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemNameDialogComponent } from './new-item-name-dialog.component';

describe('NewItemNameDialogComponent', () => {
  let component: NewItemNameDialogComponent;
  let fixture: ComponentFixture<NewItemNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItemNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
