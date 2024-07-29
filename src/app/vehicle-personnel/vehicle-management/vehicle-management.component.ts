import { Component } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlateServiceService } from '../services/plate-service.service';
import { OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

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
  styleUrl: './vehicle-management.component.css',
  
})


export class VehicleManagementComponent implements OnInit {
  vehicleSets: {
    idTemporal: number;
    vehiculo: number;
    matricula: string;
    Tipo_vehiculo: string;
  }[] = [];
  matriculasSeleccionadas: string[] = [];

  constructor(
    private plateServiceService: PlateServiceService,
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {
    this.addVehicleSet(); // Añadir un conjunto de vehículos inicial
  }

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculasSeleccionadas = labels;
    });
  }

  addVehicleSet(): void {
    const idTemporal = Date.now();
    this.vehicleSets.push({ idTemporal: idTemporal, vehiculo: 0, matricula: '', Tipo_vehiculo: '' });
    this.updateMatriculasSeleccionadas();
  }

  removeVehicleSet(index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      const matricula = this.vehicleSets[index].matricula;
      const idTemporal = this.vehicleSets[index].idTemporal;
      this.vehicleSets.splice(index, 1);
      this.updateMatriculasSeleccionadas();
      if (matricula) {
        this.plateServiceService.removeSelectedLabel(matricula);
      }
      if (idTemporal) {
        this.dataSharingService.removeDropdownType(idTemporal);
      }
    }
  }

  setMatricula(matricula: string, index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      this.vehicleSets[index].matricula = matricula;
      this.updateMatriculasSeleccionadas();
    } else {
      console.error('Índice fuera de rango para actualizar matrícula:', index);
    }
  }

  onVehicleTypeSelected(event: { columnIndex: number, label: string }, index: number): void {
    const idTemporal = this.vehicleSets[index].idTemporal;

    // Actualizar o añadir la etiqueta en el servicio
    if (this.dataSharingService.getDropdownType(idTemporal)) {
      this.dataSharingService.updateDropdownTypeById(idTemporal, event.label);
    } else {
      this.dataSharingService.addDropdownType(idTemporal, event.label);
    }

    this.vehicleSets[index].vehiculo = event.columnIndex;
    this.vehicleSets[index].Tipo_vehiculo = event.label;
  }

  updateMatriculasSeleccionadas(): void {
    const matriculas = this.vehicleSets.map(vehicleSet => vehicleSet.matricula || '');
    matriculas.forEach((matricula, index) => {
      this.plateServiceService.updateMatricula(index, matricula);
    });
  }

  getVehicleData(): any[] {
    return this.vehicleSets.map(vehicleSet => ({
      Matricula: vehicleSet.matricula,
      Tipo_carro: vehicleSet.Tipo_vehiculo,
      Conductor: '', // Aquí deberías obtener el conductor si es necesario
    }));
  }
}

  

