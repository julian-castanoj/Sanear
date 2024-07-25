import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { VehicleTypeDropdownComponent } from './vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component';
import { VehiclePlateSelectorComponent } from './vehicle-management/vehicle-plate-selector/vehicle-plate-selector.component';
import { VehicleFormDriversComponent } from './vehicle-form-drivers/vehicle-form-drivers.component';
import { VehicleDriverDropdownComponent } from './vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';

import { VehicleDriverObservationComponent } from './vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';

import { PlateServiceService } from './services/plate-service.service';

@NgModule({
  providers: [PlateServiceService],
  imports: [
    CommonModule,
    FormsModule,
    VehicleManagementComponent,  
    VehicleTypeDropdownComponent,
    VehiclePlateSelectorComponent,
    VehicleFormDriversComponent,
    VehicleDriverDropdownComponent,
    
    VehicleDriverObservationComponent
  ],
  exports: [
    VehicleManagementComponent,
    VehicleTypeDropdownComponent,
    VehiclePlateSelectorComponent,
    VehicleFormDriversComponent,
    VehicleDriverDropdownComponent,
    
    VehicleDriverObservationComponent
  ]
})

export class VehicleManagementModule {

}