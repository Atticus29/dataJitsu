import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCreationStepperTwoComponent } from './collection-creation-stepper-two.component';

describe('CollectionCreationStepperTwoComponent', () => {
  let component: CollectionCreationStepperTwoComponent;
  let fixture: ComponentFixture<CollectionCreationStepperTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionCreationStepperTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCreationStepperTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
