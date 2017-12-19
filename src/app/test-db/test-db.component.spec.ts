import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDbComponent } from './test-db.component';

describe('TestDbComponent', () => {
  let component: TestDbComponent;
  let fixture: ComponentFixture<TestDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
