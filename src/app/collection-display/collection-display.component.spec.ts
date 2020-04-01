import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDisplayComponent } from './collection-display.component';

describe('CollectionDisplayComponent', () => {
  let component: CollectionDisplayComponent;
  let fixture: ComponentFixture<CollectionDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
