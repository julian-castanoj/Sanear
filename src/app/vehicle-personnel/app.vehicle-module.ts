import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { VehicleTypeDropdownComponent } from './vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component';

@NgModule({
  declarations: [
    VehicleManagementComponent,
    VehicleTypeDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule // Asegúrate de importar FormsModule aquí
  ],
  exports: [
    VehicleManagementComponent,
    VehicleTypeDropdownComponent
  ]
})
export class VehicleManagementModule { }