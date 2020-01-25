import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCreationFormComponent } from './collection-creation-form.component';

describe('CollectionCreationFormComponent', () => {
  let component: CollectionCreationFormComponent;
  let fixture: ComponentFixture<CollectionCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
