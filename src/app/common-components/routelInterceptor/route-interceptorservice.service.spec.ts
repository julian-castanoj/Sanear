import { TestBed } from '@angular/core/testing';

import { RouteInterceptorserviceService } from './route-interceptorservice.service';

describe('RouteInterceptorserviceService', () => {
  let service: RouteInterceptorserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteInterceptorserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
