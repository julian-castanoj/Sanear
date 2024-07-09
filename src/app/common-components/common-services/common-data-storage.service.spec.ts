import { TestBed } from '@angular/core/testing';

import { CommonDataStorageService } from './common-data-storage.service';

describe('CommonDataStorageService', () => {
  let service: CommonDataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
