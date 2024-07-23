import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormDriversComponent } from './vehicle-form-drivers.component';

describe('VehicleFormDriversComponent', () => {
  let component: VehicleFormDriversComponent;
  let fixture: ComponentFixture<VehicleFormDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormDriversComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFormDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
