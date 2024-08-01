import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlateServiceService } from '../services/plate-service.service';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { NgFor } from '@angular/common';

export interface VehicleSet {
  idTemporal: number;
  vehiculo: number;
  matricula: string;
  Tipo_carro: string;
  conductor: string;
  observacion: string;
}

export interface DriverData {
  driver: string;
  observation: string;
  Tipo_carro: string;
}

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.css'],
  standalone: true,
  imports: [NgFor]
})
export class VehicleManagementComponent implements OnInit {
  driverData: { [matricula: string]: DriverData } = {};
  vehicleSets: VehicleSet[] = [];
  matriculasSeleccionadas: string[] = [];
  idCounter = 0;

  constructor(
    private plateServiceService: PlateServiceService,
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService,
    private cdr: ChangeDetectorRef
  ) {
    this.addVehicleSet();
  }

  ngOnInit(): void {
    console.log('Matrículas seleccionadas en ngOnInit:', this.matriculasSeleccionadas);
    this.asignarTipoCarro();
  }

  asignarTipoCarro(): void {
    this.matriculasSeleccionadas.forEach(matricula => {
      const tipoCarro = this.driverData[matricula]?.Tipo_carro || '';
      this.actualizarTipoCarro(matricula, tipoCarro);
    });
  }

  actualizarTipoCarro(matricula: string, tipoCarro: string): void {
    if (!this.driverData[matricula]) {
      this.driverData[matricula] = { driver: '', observation: '', Tipo_carro: '' };
    }
    this.driverData[matricula].observation = tipoCarro;
    console.log('Tipo de carro actualizado para matrícula', matricula, ':', tipoCarro);
  }

  addVehicleSet(): void {
    const idTemporal = this.idCounter++;
    const newSet = {
      idTemporal,
      vehiculo: 0,
      matricula: '',
      Tipo_carro: '',
      conductor: '',
      observacion: '',
    };
    this.vehicleSets.push(newSet);
    this.driverData[newSet.matricula] = {
      driver: '',
      observation: '',
      Tipo_carro: 'valor_por_defecto'
    };
    console.log('Nuevo conjunto de vehículos agregado:', this.vehicleSets);
    this.dataSharingService.updateDriverData(newSet.matricula, this.driverData[newSet.matricula]);
  }

  setMatricula(matricula: string, index: number): void {
    const set = this.vehicleSets[index];
    if (set) {
      set.matricula = matricula;
      this.updateMatriculasSeleccionadas();
      console.log(`Matrícula actualizada para el conjunto ${index}: ${matricula}`);
    }
  }

  onVehicleTypeSelection(event: any, index: number): void {
    const set = this.vehicleSets[index];
    if (set && event) {
      const matricula = set.matricula.trim();
      if (!matricula) {
        console.error('La matrícula está vacía.');
        return;
      }

      const tipoCarro = event.label.trim();
      if (!tipoCarro) {
        console.error('El tipo de carro está vacío.');
        return;
      }

      this.driverData[matricula].observation = tipoCarro;
      set.Tipo_carro = tipoCarro;

      this.dataSharingService.updateDriverData(matricula, this.driverData[matricula]);

      console.log('Actualizando vehicleSets:', this.vehicleSets);
      console.log('Actualizando driverData:', this.driverData);
      this.cdr.detectChanges();
    }
  }

  updateMatriculasSeleccionadas(): void {
    this.matriculasSeleccionadas = this.vehicleSets.map(
      (vehicleSet) => vehicleSet.matricula
    );
    this.matriculasSeleccionadas.forEach((matricula, index) => {
      this.plateServiceService.updateMatricula(index, matricula);
    });
    console.log('Matrículas seleccionadas actualizadas:', this.matriculasSeleccionadas);
  }

  removeVehicleSet(index: number): void {
    if (index >= 0 && index < this.vehicleSets.length) {
      this.vehicleSets.splice(index, 1);
      delete this.driverData[this.vehicleSets[index].matricula];
      console.log('Conjunto de vehículo eliminado en el índice:', index);
    }
  }
}