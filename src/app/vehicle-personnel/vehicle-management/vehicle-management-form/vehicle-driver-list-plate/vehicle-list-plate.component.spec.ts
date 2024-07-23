import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListPlateComponent } from './vehicle-list-plate.component';

describe('VehicleListPlateComponent', () => {
  let component: VehicleListPlateComponent;
  let fixture: ComponentFixture<VehicleListPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleListPlateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleListPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
