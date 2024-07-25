import { Component } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlateServiceService } from '../services/plate-service.service';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    VehicleTypeDropdownComponent,
    FormsModule,
    VehiclePlateSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-management.component.html',
  styleUrl: './vehicle-management.component.css'
})


export class VehicleManagementComponent {
  vehicleSets: {
    idTemporal: number;
    vehiculo: number;
    matricula: string;
    Tipo_vehiculo: string;
  }[] = [];

  constructor(private plateServiceService: PlateServiceService) {
    this.addVehicleSet(); // Añadir un conjunto de vehículos inicial
  }

  addVehicleSet(): void {
    const idTemporal = Date.now();
    this.vehicleSets.push({ idTemporal: idTemporal, vehiculo: 0, matricula: '', Tipo_vehiculo: '' });
    this.updatePlateService(this.vehicleSets.length - 1); // Actualizar servicio al añadir un nuevo conjunto de vehículos
  }

  removeVehicleSet(index: number): void {
    if (this.vehicleSets.length > 1) {
      this.vehicleSets.splice(index, 1);
      // Actualizar el servicio después de eliminar un conjunto de vehículos
      this.updatePlateService(index);
    }
    //console.log('Vehicle Sets:', this.vehicleSets);
  }

  setMatricula(newValue: string, index: number): void {
    this.vehicleSets[index].matricula = newValue;
    this.updatePlateService(index);
    console.log(this.vehicleSets); // Mostrar en consola el estado actual de vehicleSets
  }
  
  onVehicleTypeSelected(event: { columnIndex: number, label: string }, index: number): void {
    this.vehicleSets[index].vehiculo = event.columnIndex;
    this.vehicleSets[index].Tipo_vehiculo = event.label;
    // Puedes realizar otras acciones necesarias aquí
  }

  private subscribeToSelectedLabels(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      // console.log('Selected Labels:', labels);
      // Puedes realizar cualquier lógica adicional aquí según sea necesario
    });
  }

  updatePlateService(index: number): void {
    const matricula = this.vehicleSets[index].matricula;
    this.plateServiceService.updateMatricula(index, matricula);
  }
}