import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReputationLogComponent } from './reputation-log.component';

describe('ReputationLogComponent', () => {
  let component: ReputationLogComponent;
  let fixture: ComponentFixture<ReputationLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReputationLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReputationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
