import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlateServiceService } from '../services/plate-service.service';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService, DriverData  } from '../services/data-sharing.service';

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
  styleUrls: ['./vehicle-management.component.css'] // Nota: usé styleUrls en lugar de styleUrl
})

export class VehicleManagementComponent implements OnInit {
  driverData: { [matricula: string]: DriverData } = {};

  vehicleSets: {
    idTemporal: number;
    vehiculo: number;
    matricula: string;
    Tipo_carro: string;
  }[] = [];
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
      this.driverData[matricula] = { driver: '', observation: '', Tipo_carro: tipoCarro };
    } else {
      this.driverData[matricula].Tipo_carro = tipoCarro;
    }
   
  }

  actualizarDatosConductor(matricula: string, driver: string, observation: string): void {
    if (this.driverData[matricula]) {
      this.driverData[matricula].driver = driver;
      this.driverData[matricula].observation = observation;
    }
  }

  loadDriverData(matricula: string): void {
    const data = this.dataSharingService.getDriverData(matricula);
    console.log('Datos del conductor para matrícula', matricula, ':', data);
  }

  addVehicleSet(): void {
    const idTemporal = this.idCounter++;
    const newSet = {
      idTemporal,
      vehiculo: 0,
      matricula: '',
      Tipo_carro: '',
    };
    this.vehicleSets.push(newSet);
    this.driverData[newSet.matricula] = {
      driver: '',
      observation: '',
      Tipo_carro: '',
    };
    console.log('Nuevo conjunto de vehículos agregado:', this.vehicleSets);
    this.dataSharingService.updateDriverData(this.driverData);
  }

  removeVehicleSet(index: number): void {
    if (this.vehicleSets.length > 1) {
      const idTemporal = this.vehicleSets[index].idTemporal;
      this.vehicleSets.splice(index, 1);
      delete this.driverData[idTemporal];
      this.updateMatriculasSeleccionadas();
      this.cdr.detectChanges();
      console.log('Conjuntos de vehículos después de eliminar uno:', this.vehicleSets);
    }
  }

  setMatricula(matricula: string, index: number): void {
    const set = this.vehicleSets[index];
    if (set) {
      set.matricula = matricula;
      this.updateMatriculasSeleccionadas();
      console.log(Matrícula actualizada para el conjunto ${index}: ${matricula});
    }
  }

  onVehicleTypeSelected(event: { columnIndex: number; label: string } | undefined, index: number): void {
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
  
      console.log('Datos recibidos en VehicleManagementComponent:', event); // Log para los datos recibidos
  
      // Actualiza driverData y vehicleSets
      this.driverData[matricula] = {
        driver: this.driverData[matricula]?.driver || '',
        observation: this.driverData[matricula]?.observation || '',
        Tipo_carro: tipoCarro,
      };
  
      set.Tipo_carro = tipoCarro;
  
      // Actualiza el servicio
      this.dataSharingService.updateDriverData(matricula, driver, observation);
  
      // Depuración
      console.log('Actualizando vehicleSets:', this.vehicleSets);
      console.log('Actualizando driverData:', this.driverData);
      this.cdr.detectChanges(); // Asegúrate de que los cambios se reflejen en la vista
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

  getVehicleData(): any[] {
    const vehicleData = this.vehicleSets.map((vehicleSet) => ({
      Matricula: vehicleSet.matricula,
      Tipo_carro: vehicleSet.Tipo_carro,
      Conductor:
        this.driverData[vehicleSet.matricula]?.driver || '',
    }));
    console.log('Datos de vehículos obtenidos:', vehicleData);

    return vehicleData;
  }
}