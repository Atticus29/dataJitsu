import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericNewVideoFormComponent } from './generic-new-video-form.component';

describe('GenericNewVideoFormComponent', () => {
  let component: GenericNewVideoFormComponent;
  let fixture: ComponentFixture<GenericNewVideoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericNewVideoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericNewVideoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
