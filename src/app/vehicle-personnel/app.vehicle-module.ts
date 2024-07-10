import { VehiclePersonnelInterfaceComponent } from '../vehicle-personnel/vehicle-personnel-interface/vehicle-personnel-interface.component';
import { VehicleManagementComponent } from '../vehicle-personnel/vehicle-management/vehicle-management.component';
import { VehiclePlateSelectorComponent } from './vehicle-management/vehicle-plate-selector/vehicle-plate-selector.component';
import { VehicleTypeDropdownComponent } from './vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
      VehicleManagementComponent,
      VehicleTypeDropdownComponent,
      VehiclePlateSelectorComponent
    ],
    imports: [
      CommonModule,
      FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agrega CUSTOM_ELEMENTS_SCHEMA si es un Web Component
  })
  export class VehicleManagementModule { }