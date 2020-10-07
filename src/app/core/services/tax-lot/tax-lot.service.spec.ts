import { TestBed } from '@angular/core/testing';

import { TaxLotService } from './tax-lot.service';

describe('TaxLotService', () => {
  let service: TaxLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
