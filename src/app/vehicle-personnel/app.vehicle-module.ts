import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { VehicleTypeDropdownComponent } from './vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component';
import { VehiclePlateSelectorComponent } from './vehicle-management/vehicle-plate-selector/vehicle-plate-selector.component';
import { VehicleFormDriversComponent } from './vehicle-form-drivers/vehicle-form-drivers.component';
import { VehicleDriverDropdownComponent } from './vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';
import { VehicleDriverObservationComponent } from './vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';
import { DataSharingService } from './services/data-sharing.service';

@NgModule({
  declarations: [
    // Aquí no deben estar los componentes, solo los módulos.
  ],
  imports: [
    CommonModule,
    FormsModule,
    // Importa los componentes aquí
    VehicleManagementComponent,
    VehicleTypeDropdownComponent,
    VehiclePlateSelectorComponent,
    VehicleFormDriversComponent,
    VehicleDriverDropdownComponent,
    VehicleDriverObservationComponent
  ],
  exports: [
    // Exporta los componentes que necesitas usar fuera del módulo
    VehicleManagementComponent,
    VehicleTypeDropdownComponent,
    VehiclePlateSelectorComponent,
    VehicleFormDriversComponent,
    VehicleDriverDropdownComponent,
    VehicleDriverObservationComponent
  ],
  providers: [
    DataSharingService
    // Otros servicios que necesites proveer
  ]
})
export class VehicleManagementModule {}