import { Component } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlateServiceService } from '../services/plate-service.service';
import { OnInit } from '@angular/core';
import { DataSharingService } from '../services/data-sharing.service';

export interface VehicleSet {
  idTemporal: number;
  vehiculo: number;
  matricula: string;
  Tipo_vehiculo: string;
}

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

export class VehicleManagementComponent implements OnInit {
  vehicleSets: VehicleSet[] = [];
  matriculasSeleccionadas: string[] = [];

  constructor(private plateServiceService: PlateServiceService, private dataSharingService: DataSharingService) {
    this.addVehicleSet(); // Añadir un conjunto de vehículos inicial
  }

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculasSeleccionadas = labels;
    });

    // Inicializar los conjuntos de vehículos en el servicio
    this.dataSharingService.updateVehicleSets(this.vehicleSets);
  }

  addVehicleSet(): void {
    const idTemporal = Date.now();
    this.vehicleSets.push({ idTemporal, vehiculo: 0, matricula: '', Tipo_vehiculo: '' });
    this.updateMatriculasSeleccionadas(); // Actualizar el servicio al añadir un nuevo conjunto de vehículos
    console.log('Nuevo conjunto de vehículos añadido:', this.vehicleSets);
    this.dataSharingService.updateVehicleSets(this.vehicleSets); // Actualizar el servicio con los nuevos datos
  }

  removeVehicleSet(index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      const matricula = this.vehicleSets[index].matricula;
      this.vehicleSets.splice(index, 1);
      this.updateMatriculasSeleccionadas();
      console.log('Conjunto de vehículos eliminado en el índice', index, ':', this.vehicleSets);
      if (matricula) {
        this.plateServiceService.removeSelectedLabel(matricula);
      }
      this.dataSharingService.updateVehicleSets(this.vehicleSets); // Actualizar el servicio con los datos restantes
    }
  }

  setMatricula(matricula: string, index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      this.vehicleSets[index].matricula = matricula;
      this.updateMatriculasSeleccionadas();
      console.log('Matrícula actualizada en el índice', index, ':', this.vehicleSets[index]);
      this.dataSharingService.updateVehicleSets(this.vehicleSets); // Actualizar el servicio con los datos actualizados
    } else {
      console.error('Índice fuera de rango para actualizar matrícula:', index);
    }
  }

  onVehicleTypeSelected(event: { columnIndex: number, label: string }, index: number): void {
    this.vehicleSets[index].vehiculo = event.columnIndex;
    this.vehicleSets[index].Tipo_vehiculo = event.label;
    console.log('Tipo de vehículo actualizado en el índice', index, ':', this.vehicleSets[index]);
    this.dataSharingService.updateVehicleSets(this.vehicleSets); // Actualizar el servicio con los datos actualizados
  }

  updateMatriculasSeleccionadas(): void {
    const matriculas = this.vehicleSets.map(vehicleSet => vehicleSet.matricula || '');
    matriculas.forEach((matricula, index) => {
      this.plateServiceService.updateMatricula(index, matricula);
    });
    console.log('Actualización de matrículas seleccionadas:', this.vehicleSets);
  }

  
  clearData(): void {
    this.vehicleSets = [];
    this.matriculasSeleccionadas = [];
    this.plateServiceService.clearSelectedLabels(); // Suponiendo que este método existe en PlateServiceService
    this.dataSharingService.updateVehicleSets(this.vehicleSets); // Actualizar el servicio con los datos limpiados
    console.log('Datos en VehicleManagementComponent limpiados.');
  }

}