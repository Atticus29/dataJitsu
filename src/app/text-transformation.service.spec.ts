import { TestBed, inject } from '@angular/core/testing';

import { TextTransformationService } from './text-transformation.service';

describe('TextTransformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextTransformationService]
    });
  });

  it('should be created', inject([TextTransformationService], (service: TextTransformationService) => {
    expect(service).toBeTruthy();
  }));
});
