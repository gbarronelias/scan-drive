import { TestBed } from '@angular/core/testing';

import { GenApiService } from './gen-api.service';

describe('GenApiService', () => {
  let service: GenApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
