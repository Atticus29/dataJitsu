import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMatchDataDisplayComponent } from './individual-match-data-display.component';

describe('IndividualMatchDataDisplayComponent', () => {
  let component: IndividualMatchDataDisplayComponent;
  let fixture: ComponentFixture<IndividualMatchDataDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualMatchDataDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMatchDataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
