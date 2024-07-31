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
  Tipo_carro: string;
}

@Component({
  standalone: true,
  imports: [VehicleDriverDropdownComponent,VehicleDriverObservationComponent,NgIf,NgFor],
  selector: 'app-vehicle-form-drivers',
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrls: ['./vehicle-form-drivers.component.css']
})

export class VehicleFormDriversComponent implements OnInit, OnChanges, OnDestroy {
  @Input() matriculasSeleccionadas: string[] = [];
  driverData: { [matricula: string]: DriverData } = {};
  dropdownTypes: string[] = []; // Define esta propiedad aquí
  private subscription: Subscription = new Subscription();

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.dataSharingService.selectedLabels$.subscribe((labels: string[]) => {
        this.matriculasSeleccionadas = labels;
        this.loadDriverData();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matriculasSeleccionadas']) {
      this.loadDriverData();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDriverData(): void {
    this.matriculasSeleccionadas.forEach(matricula => {
      this.driverData[matricula] = this.dataSharingService.getDriverData(matricula) || { driver: '', observation: '', Tipo_carro: '' };
    });
  }

  onDriverChange(matricula: string, event: { columnIndex: number; label: string }): void {
    const Tipo_carro = event.columnIndex >= 0 ? this.dropdownTypes[event.columnIndex] : '';
    const driver = event.label;
    const observation = this.driverData[matricula]?.observation || '';
  
    this.driverData[matricula] = { driver, observation, Tipo_carro };
    this.dataSharingService.updateDriverData(matricula, this.driverData[matricula]);
  }

  onObservationChange(matricula: string, observation: string): void {
    this.driverData[matricula] = { ...this.driverData[matricula], observation };
    this.dataSharingService.updateDriverData(matricula, this.driverData[matricula]);
  }
}