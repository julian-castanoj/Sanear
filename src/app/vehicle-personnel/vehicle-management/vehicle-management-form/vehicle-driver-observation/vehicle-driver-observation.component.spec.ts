import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDriverObservationComponent } from './vehicle-driver-observation.component';

describe('VehicleDriverObservationComponent', () => {
  let component: VehicleDriverObservationComponent;
  let fixture: ComponentFixture<VehicleDriverObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDriverObservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDriverObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
