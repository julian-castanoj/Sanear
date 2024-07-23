import { TestBed } from '@angular/core/testing';

import { PlateServiceService } from './plate-service.service';

describe('PlateServiceService', () => {
  let service: PlateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
