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
    this.addVehicleSet();
  }

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculasSeleccionadas = labels;
    });
    this.dataSharingService.updateVehicleSets(this.vehicleSets);
  }

  addVehicleSet(): void {
    const idTemporal = Date.now();
    this.vehicleSets.push({ idTemporal, vehiculo: 0, matricula: '', Tipo_vehiculo: '' });
    this.updateMatriculasSeleccionadas(); 
    this.dataSharingService.updateVehicleSets(this.vehicleSets); 
  }

  removeVehicleSet(index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      const matricula = this.vehicleSets[index].matricula;
      this.vehicleSets.splice(index, 1);
      this.updateMatriculasSeleccionadas();
      if (matricula) {
        this.plateServiceService.removeSelectedLabel(matricula);
      }
      this.dataSharingService.updateVehicleSets(this.vehicleSets); 
    }
  }

  setMatricula(matricula: string, index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      this.vehicleSets[index].matricula = matricula;
      this.updateMatriculasSeleccionadas();
      this.dataSharingService.updateVehicleSets(this.vehicleSets); 
    } else {
      console.error('Índice fuera de rango para actualizar matrícula:', index);
    }
  }

  onVehicleTypeSelected(event: { columnIndex: number, label: string }, index: number): void {
    this.vehicleSets[index].vehiculo = event.columnIndex;
    this.vehicleSets[index].Tipo_vehiculo = event.label;
    this.dataSharingService.updateVehicleSets(this.vehicleSets); 
  }

  updateMatriculasSeleccionadas(): void {
    const matriculas = this.vehicleSets.map(vehicleSet => vehicleSet.matricula || '');
    matriculas.forEach((matricula, index) => {
      this.plateServiceService.updateMatricula(index, matricula);
    });
  }
 
  clearData(): void {
    this.vehicleSets = [];
    this.matriculasSeleccionadas = [];
    this.plateServiceService.clearSelectedLabels();
    this.dataSharingService.updateVehicleSets(this.vehicleSets);
  }
}