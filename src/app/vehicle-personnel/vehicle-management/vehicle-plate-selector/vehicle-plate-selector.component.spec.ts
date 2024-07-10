import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePlateSelectorComponent } from './vehicle-plate-selector.component';

describe('VehiclePlateSelectorComponent', () => {
  let component: VehiclePlateSelectorComponent;
  let fixture: ComponentFixture<VehiclePlateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclePlateSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePlateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
