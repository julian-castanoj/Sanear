import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDriverDropdownComponent } from './vehicle-driver-dropdown.component';

describe('VehicleDriverDropdownComponent', () => {
  let component: VehicleDriverDropdownComponent;
  let fixture: ComponentFixture<VehicleDriverDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDriverDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDriverDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
