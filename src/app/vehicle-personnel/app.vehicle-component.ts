import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { VehiclePlateSelectorComponent } from '../vehicle-personnel/vehicle-management/vehicle-plate-selector/vehicle-plate-selector.component';

@NgModule({
  declarations: [
    VehiclePlateSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule // Importa FormsModule aquí si usas NgModel
  ],
  exports: [
    VehiclePlateSelectorComponent // Exporta el componente para usarlo en otros módulos
  ]
})
export class VehicleComponentModule { }