import { Component } from '@angular/core';
import { VehicleDriverDropdownComponent } from '../vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';
import { VehicleDriverObservationComponent } from '../vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';
import { PlateServiceService } from '../services/plate-service.service';
import { NgIf,NgFor } from '@angular/common';
import { OnInit , Input} from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { Subscription } from 'rxjs';
import { OnDestroy, OnChanges, SimpleChanges } from '@angular/core';


interface DriverData {
  driver: string;
  observation: string;
  tipoCarroLabel: string;
}

@Component({
  standalone: true,
  imports: [VehicleDriverDropdownComponent,VehicleDriverObservationComponent,NgIf,NgFor],
  selector: 'app-vehicle-form-drivers',
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrls: ['./vehicle-form-drivers.component.css']
})

export class VehicleFormDriversComponent implements OnInit, OnDestroy, OnChanges {
  @Input() matriculasSeleccionadas: string[] = [];
  @Input() driverData: { [matricula: string]: DriverData } = {};

  private subscription: Subscription = new Subscription();

  // Opcional: Agrega esto si tienes un listado de etiquetas para conversiones
  dropdownTypes: string[] = []; 

  constructor(
    private plateServiceService: PlateServiceService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.driverData = this.dataSharingService.getAllDriverData();
    this.subscription.add(
      this.plateServiceService.selectedLabels$.subscribe((labels) => {
        this.matriculasSeleccionadas = labels;
        this.loadDriverData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matriculasSeleccionadas'] || changes['driverData']) {
      this.updateTable();
    }
  }

  loadDriverData(): void {
    this.matriculasSeleccionadas.forEach(matricula => {
      const data = this.dataSharingService.getDriverData(matricula);
      this.driverData[matricula] = data || { driver: '', observation: '', tipoCarroLabel: '' };
    });
  }

  onDriverDataUpdate(matricula: string, driver: string, observation: string, tipoCarroLabel: string): void {
    if (driver === '' && observation === '') {
      delete this.driverData[matricula];
    } else {
      this.driverData[matricula] = { driver, observation, tipoCarroLabel };
    }
    this.dataSharingService.updateDriverData(matricula, driver, observation, tipoCarroLabel);
    console.log(`Datos actualizados para ${matricula}:`, this.driverData[matricula]);
  }

  onDriverChange(matricula: string, event: { columnIndex: number; label: string }): void {
    const tipoCarroLabel = this.dropdownTypes[event.columnIndex]; // Convierte el índice a una etiqueta de cadena
    const driver = event.label;
    const observation = this.driverData[matricula]?.observation || '';
    this.driverData[matricula] = { driver, observation, tipoCarroLabel };
    this.dataSharingService.updateDriverData(matricula, driver, observation, tipoCarroLabel);
  }

  onObservationChange(matricula: string, observation: string): void {
    const driver = this.driverData[matricula]?.driver || '';
    const tipoCarroLabel = this.driverData[matricula]?.tipoCarroLabel || '';
    this.driverData[matricula] = { driver, observation, tipoCarroLabel };
    this.dataSharingService.updateDriverData(matricula, driver, observation, tipoCarroLabel);
  }

  updateTable(): void {
    // Aquí puedes manejar la lógica para actualizar la tabla basada en los cambios
    console.log('Tabla actualizada con matriculasSeleccionadas y driverData');
  }
}