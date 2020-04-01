import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCollectionsDisplayComponent } from './user-collections-display.component';

describe('UserCollectionsDisplayComponent', () => {
  let component: UserCollectionsDisplayComponent;
  let fixture: ComponentFixture<UserCollectionsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCollectionsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCollectionsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
