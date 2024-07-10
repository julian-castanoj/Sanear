import { Component } from '@angular/core';
import { VehicleManagementFormComponent } from "./vehicle-management-form/vehicle-management-form.component";
import { VehicleTypeDropdownComponent } from "./vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    VehicleManagementFormComponent, 
    VehicleTypeDropdownComponent, 
    VehiclePlateSelectorComponent],
  templateUrl:   './vehicle-management.component.html',
  styleUrl: './vehicle-management.component.css'
})

export class VehicleManagementComponent {
  vehicleSets: any[] = []; // Arreglo para almacenar conjuntos de datos de vehículos

  constructor() {
    // Agrega el primer conjunto de vehículos al inicializar el componente
    this.addVehicleSet();
  }

  addVehicleSet() {
    this.vehicleSets.push({
      type: '',
      plate: ''
    });
  }

  removeVehicleSet(index: number) {
    // Verifica si hay más de un conjunto antes de eliminar
    if (this.vehicleSets.length > 1) {
      this.vehicleSets.splice(index, 1);
    }
  }
}
