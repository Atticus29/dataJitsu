import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVideosComponent } from './all-videos.component';

describe('AllVideosComponent', () => {
  let component: AllVideosComponent;
  let fixture: ComponentFixture<AllVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
