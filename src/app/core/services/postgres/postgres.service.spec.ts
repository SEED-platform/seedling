import { TestBed } from '@angular/core/testing';

import { PostgresService } from './postgres.service';

describe('PostgresService', () => {
  let service: PostgresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostgresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
