import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatusReportComponent } from './user-status-report.component';

describe('UserStatusReportComponent', () => {
  let component: UserStatusReportComponent;
  let fixture: ComponentFixture<UserStatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
