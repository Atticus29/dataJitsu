import { TestBed } from '@angular/core/testing';

import { FormProcessingService } from './form-processing.service';

describe('FormProcessingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormProcessingService = TestBed.get(FormProcessingService);
    expect(service).toBeTruthy();
  });
});
