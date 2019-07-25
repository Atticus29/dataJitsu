import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationDataDisplayComponent } from './annotation-data-display.component';

describe('AnnotationDataDisplayComponent', () => {
  let component: AnnotationDataDisplayComponent;
  let fixture: ComponentFixture<AnnotationDataDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationDataDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationDataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
