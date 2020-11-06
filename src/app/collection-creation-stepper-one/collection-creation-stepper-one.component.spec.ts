import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCreationStepperOneComponent } from './collection-creation-stepper-one.component';

describe('CollectionCreationStepperOneComponent', () => {
  let component: CollectionCreationStepperOneComponent;
  let fixture: ComponentFixture<CollectionCreationStepperOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionCreationStepperOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCreationStepperOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
