import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDisplayComponent } from './match-display.component';

describe('MatchDisplayComponent', () => {
  let component: MatchDisplayComponent;
  let fixture: ComponentFixture<MatchDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
