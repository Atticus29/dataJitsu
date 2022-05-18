import { TestBed } from '@angular/core/testing';

import { DataFormattingService } from './data-formatting.service';

describe('DataFormattingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataFormattingService = TestBed.get(DataFormattingService);
    expect(service).toBeTruthy();
  });
});
