import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAnalysisDisplayComponent } from './full-analysis-display.component';

describe('FullAnalysisDisplayComponent', () => {
  let component: FullAnalysisDisplayComponent;
  let fixture: ComponentFixture<FullAnalysisDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullAnalysisDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullAnalysisDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
