import { TestBed } from '@angular/core/testing';

import { GraphingService } from './graphing.service';

describe('GraphingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphingService = TestBed.get(GraphingService);
    expect(service).toBeTruthy();
  });
});
