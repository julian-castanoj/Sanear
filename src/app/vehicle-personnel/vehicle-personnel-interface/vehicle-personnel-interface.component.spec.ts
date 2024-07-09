import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePersonnelInterfaceComponent } from './vehicle-personnel-interface.component';

describe('VehiclePersonnelInterfaceComponent', () => {
  let component: VehiclePersonnelInterfaceComponent;
  let fixture: ComponentFixture<VehiclePersonnelInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclePersonnelInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePersonnelInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
