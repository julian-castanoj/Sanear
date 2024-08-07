import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeDropdownComponent } from './vehicle-type-dropdown.component';

describe('VehicleTypeDropdownComponent', () => {
  let component: VehicleTypeDropdownComponent;
  let fixture: ComponentFixture<VehicleTypeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTypeDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
