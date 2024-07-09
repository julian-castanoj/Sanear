import { TestBed } from '@angular/core/testing';

import { CommunicationServiceDropdownPersonnelManagerService } from './communication-service-dropdown-personnel-manager.service';

describe('CommunicationServiceDropdownPersonnelManagerService', () => {
  let service: CommunicationServiceDropdownPersonnelManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationServiceDropdownPersonnelManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
