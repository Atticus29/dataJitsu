import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatedMovesDisplayComponent } from './annotated-moves-display.component';

describe('AnnotatedMovesDisplayComponent', () => {
  let component: AnnotatedMovesDisplayComponent;
  let fixture: ComponentFixture<AnnotatedMovesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotatedMovesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatedMovesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
