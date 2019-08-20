import { TestBed } from '@angular/core/testing';

import { DateCalculationsService } from './date-calculations.service';

describe('DateCalculationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateCalculationsService = TestBed.get(DateCalculationsService);
    expect(service).toBeTruthy();
  });
});
