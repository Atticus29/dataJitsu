import { TestBed, inject } from '@angular/core/testing';

import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService]
    });
  });

  it('should ...', inject([ValidationService], (service: ValidationService) => {
    expect(service).toBeTruthy();
  }));

  it('should have a date be valid but a string with just words but false', inject([ValidationService], (service: ValidationService) =>{
    expect(service.validateDate("asdfdab")).toBeTruthy();
    expect(service.validateDate("Wed May 09 2018 00:00:00 GMT-0700 (PDT)")).toBe(false);
  }));
});
