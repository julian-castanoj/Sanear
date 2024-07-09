import { TestBed } from '@angular/core/testing';

import { CommonDataDharingService } from './common-data-sharing.service';

describe('CommonDataDharingService', () => {
  let service: CommonDataDharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonDataDharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
