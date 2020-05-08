import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVideoComponent } from './new-video.component';

describe('NewVideoComponent', () => {
  let component: NewVideoComponent;
  let fixture: ComponentFixture<NewVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
