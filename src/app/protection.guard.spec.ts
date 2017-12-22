import { TestBed, async, inject } from '@angular/core/testing';

import { ProtectionGuard } from './protection.guard';

describe('ProtectionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProtectionGuard]
    });
  });

  it('should ...', inject([ProtectionGuard], (guard: ProtectionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
