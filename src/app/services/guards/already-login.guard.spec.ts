import { TestBed, async, inject } from '@angular/core/testing';

import { AlreadyLoginGuard } from './already-login.guard';

describe('AlreadyLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlreadyLoginGuard]
    });
  });

  it('should ...', inject([AlreadyLoginGuard], (guard: AlreadyLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
