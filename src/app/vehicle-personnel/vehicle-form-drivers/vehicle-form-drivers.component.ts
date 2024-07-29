import { Component } from '@angular/core';
import { VehicleDriverDropdownComponent } from '../vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';
import { VehicleDriverObservationComponent } from '../vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';
import { PlateServiceService } from '../services/plate-service.service';
import { NgIf,NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  standalone: true,
  imports: [VehicleDriverDropdownComponent,VehicleDriverObservationComponent,NgIf,NgFor],
  selector: 'app-vehicle-form-drivers',
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrls: ['./vehicle-form-drivers.component.css']
})

export class VehicleFormDriversComponent implements OnInit {
  matriculasSeleccionadas: string[] = [];
  driverData: { [matricula: string]: { driver: string, observation: string } } = {};

  constructor(
    private plateServiceService: PlateServiceService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculasSeleccionadas = labels;
      this.loadDriverData();
    });
  }

  loadDriverData(): void {
    this.matriculasSeleccionadas.forEach(matricula => {
      const data = this.dataSharingService.getDriverData(matricula);
      if (data) {
        this.driverData[matricula] = data;
      }
    });
  }

  onDriverChange(matricula: string, event: { columnIndex: number, label: string }): void {
    this.driverData[matricula] = { ...this.driverData[matricula], driver: event.label };
    console.log(`Driver updated for ${matricula}:`, this.driverData[matricula]);
    this.dataSharingService.updateDriverData(matricula, event.label, this.driverData[matricula]?.observation || '');
  }

  onObservationChange(matricula: string, observation: string): void {
    this.driverData[matricula] = { ...this.driverData[matricula], observation };
    console.log(`Observation updated for ${matricula}:`, this.driverData[matricula]);
    this.dataSharingService.updateDriverData(matricula, this.driverData[matricula]?.driver || '', observation);
  }
}
  