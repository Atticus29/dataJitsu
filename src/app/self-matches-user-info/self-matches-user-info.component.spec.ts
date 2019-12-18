import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfMatchesUserInfoComponent } from './self-matches-user-info.component';

describe('SelfMatchesUserInfoComponent', () => {
  let component: SelfMatchesUserInfoComponent;
  let fixture: ComponentFixture<SelfMatchesUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfMatchesUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfMatchesUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
