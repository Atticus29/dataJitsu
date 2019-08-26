import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationLegendDialogComponent } from './annotation-legend-dialog.component';

describe('AnnotationLegendDialogComponent', () => {
  let component: AnnotationLegendDialogComponent;
  let fixture: ComponentFixture<AnnotationLegendDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationLegendDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationLegendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
