import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlateServiceService } from '../services/plate-service.service';
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
  styleUrls: ['./vehicle-management.component.css'] // Nota: usé `styleUrls` en lugar de `styleUrl`
})

export class VehicleManagementComponent implements OnInit {
  vehicleSets: {
    idTemporal: number;
    vehiculo: number;
    matricula: string;
    tipoVehiculoLabel: string;  // Nueva variable para almacenar el label seleccionado
    Tipo_vehiculo: string;
  }[] = [];

  matriculasSeleccionadas: string[] = [];
  driverData: {
    [idTemporal: string]: {
      driver: string;
      observation: string;
      tipoCarroIndex: number;
      label?: string;  // Nuevo: almacenará la etiqueta del tipo de vehículo
    };
  } = {};
  idCounter: number = 1;  // Iniciar en 1 para evitar claves vacías

  constructor(
    private plateServiceService: PlateServiceService,
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService,
    private cdr: ChangeDetectorRef
  ) {
    this.addVehicleSet(); // Añadir un conjunto de vehículos inicial
  }

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe((labels) => {
      this.matriculasSeleccionadas = labels;
    });
  }

  addVehicleSet(): void {
    const idTemporal = this.idCounter++;
    this.vehicleSets.push({
      idTemporal,
      vehiculo: 0,
      matricula: '',
      tipoVehiculoLabel: '',  // Inicializar la nueva variable
      Tipo_vehiculo: '',
    });
    this.driverData[idTemporal] = {
      driver: '',
      observation: '',
      tipoCarroIndex: 0,
    };
    this.updateMatriculasSeleccionadas();
  }

  removeVehicleSet(index: number): void {
    if (this.vehicleSets.length > 1) {
      const idTemporal = this.vehicleSets[index].idTemporal;
      this.vehicleSets.splice(index, 1);
      delete this.driverData[idTemporal]; // Eliminar el driverData asociado
      this.updateMatriculasSeleccionadas(); // Actualizar la lista de matrículas
      this.cdr.detectChanges(); // Forzar la actualización de la vista si es necesario
    }
  }

  setMatricula(matricula: string, index: number): void {
    const set = this.vehicleSets[index];
    if (set) {
      set.matricula = matricula;
      this.updateMatriculasSeleccionadas();
    }
  }

  onVehicleTypeSelected(
    event: { columnIndex: number; label: string },
    index: number
  ): void {
    const set = this.vehicleSets[index];
    if (set) {
      set.vehiculo = event.columnIndex;
      set.Tipo_vehiculo = event.label;
      set.tipoVehiculoLabel = event.label; // Guardar la etiqueta seleccionada

      // Almacenar la etiqueta en el registro de driverData
      this.driverData[set.idTemporal].tipoCarroIndex = event.columnIndex;
      this.driverData[set.idTemporal].label = event.label;
    }
  }

  updateMatriculasSeleccionadas(): void {
    this.matriculasSeleccionadas = this.vehicleSets.map(
      (vehicleSet) => vehicleSet.matricula
    );
    this.matriculasSeleccionadas.forEach((matricula, index) => {
      this.plateServiceService.updateMatricula(index, matricula);
    });
  }

  getVehicleData(): any[] {
    return this.vehicleSets.map((vehicleSet) => ({
      Matricula: vehicleSet.matricula,
      Tipo_carro: vehicleSet.Tipo_vehiculo,
      Conductor:
        this.driverData[vehicleSet.idTemporal]?.driver || '', // Obtener conductor desde driverData
    }));
  }
}