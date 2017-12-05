import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMatchComponent } from './new-match.component';

describe('NewMatchComponent', () => {
  let component: NewMatchComponent;
  let fixture: ComponentFixture<NewMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
