import { Component } from '@angular/core';
import { VehicleDriverDropdownComponent } from '../vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';

import { VehicleDriverObservationComponent } from '../vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';
import { PlateServiceService } from '../services/plate-service.service';

import { NgIf,NgFor } from '@angular/common';

import { OnInit } from '@angular/core';
import { DataSharingService,VehicleSet  } from '../services/data-sharing.service';

interface VehicleInfo {
  matricula: string;
  conductor: string;
  observacion: string;
}

@Component({
  selector: 'app-vehicle-form-drivers',
  standalone: true,
  imports: [VehicleDriverDropdownComponent,VehicleDriverObservationComponent,NgIf,NgFor],
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrl: './vehicle-form-drivers.component.css'
})

export class VehicleFormDriversComponent implements OnInit {
  matriculasSeleccionadas: string[] = [];
  vehicles: VehicleInfo[] = [];

  constructor(
    private plateServiceService: PlateServiceService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculasSeleccionadas = labels;
      this.syncVehicles();
    });

    this.dataSharingService.vehicleSets$.subscribe(vehicleSets => {
      this.vehicles = vehicleSets.map(vs => ({
        matricula: vs.matricula,
        conductor: '',
        observacion: ''
      }));
    });
  }

  syncVehicles(): void {
    this.vehicles = this.matriculasSeleccionadas.map(matricula => {
      const existingVehicle = this.vehicles.find(v => v.matricula === matricula);
      return existingVehicle || { matricula, conductor: '', observacion: '' };
    });

    const vehicleSets: VehicleSet[] = this.vehicles.map(vehicle => ({
      idTemporal: Date.now(), // Ajusta según sea necesario
      vehiculo: 0, // Ajusta según sea necesario
      matricula: vehicle.matricula,
      Tipo_vehiculo: '' // Ajusta según sea necesario
    }));

    this.dataSharingService.updateVehicleSets(vehicleSets);
  }

  agregarMatricula(matricula: string): void {
    if (matricula && !this.matriculasSeleccionadas.includes(matricula)) {
      this.plateServiceService.addSelectedLabel(matricula);
    } else {
      console.warn('La matrícula ya existe o es inválida:', matricula);
    }
  }

  quitarMatricula(matricula: string): void {
    this.plateServiceService.removeSelectedLabel(matricula);
  }

  actualizarMatricula(index: number, matricula: string): void {
    if (index >= 0 && index < this.vehicles.length) {
      const vehicle = this.vehicles[index];
      if (vehicle.matricula !== matricula) {
        vehicle.matricula = matricula;
        this.plateServiceService.updateMatricula(index, matricula);
        this.syncVehicles(); // Sincroniza después de la actualización
      }
    } else {
      console.error('Índice fuera de rango para actualizar matrícula:', index);
    }
  }

  onDriverChange(matricula: string, event: { columnIndex: number; label: string }): void {
    const vehicle = this.vehicles.find(v => v.matricula === matricula);
    if (vehicle) {
      vehicle.conductor = event.label;
      console.log('Conductor seleccionado para matrícula', matricula, ':', vehicle.conductor);

      // Imprimir el VehicleInfo completo después de actualizar el conductor
      console.log('VehicleInfo actualizado:', vehicle);

      this.dataSharingService.updateDriverData(matricula, { 
        driver: vehicle.conductor,
        matricula: vehicle.matricula,
        observacion: vehicle.observacion
      });
    }
  }

  onObservationChange(matricula: string, observacion: string): void {
    const vehicle = this.vehicles.find(v => v.matricula === matricula);
    if (vehicle) {
      vehicle.observacion = observacion;
      console.log('Observación guardada para matrícula', matricula, ':', vehicle.observacion);

      // Imprimir el VehicleInfo completo después de actualizar la observación
      console.log('VehicleInfo actualizado:', vehicle);

      this.dataSharingService.updateDriverData(matricula, { 
        driver: vehicle.conductor,
        matricula: vehicle.matricula,
        observacion: vehicle.observacion
      });
    }
  }

  clearData(): void {
    // Restablecer las matrículas seleccionadas
    this.matriculasSeleccionadas = [];
    this.plateServiceService.clearSelectedLabels();

    // Restablecer los vehículos
    this.vehicles = [];
    this.dataSharingService.updateVehicleSets([]); // Enviar una lista vacía a los servicios

    console.log('Datos del componente limpiados:', {
      matriculasSeleccionadas: this.matriculasSeleccionadas,
      vehicles: this.vehicles
    });
  }
}