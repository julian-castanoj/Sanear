import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DataSharingService, ObservationEntry, PersonnelEntry } from '../services/data-sharing.service';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-days-to-register',
  standalone: true,
  imports: [NgFor],
  templateUrl: './days-to-register.component.html',
  styleUrls: ['./days-to-register.component.css']
})

export class DaysToRegisterComponent {
  @Input() dateRecords: PersonnelEntry[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService
  ) {}

  onEntradaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.dateRecords[index].entrada = value;
      this.updateDataStorage();
      this.shareDateRecords(); // Compartir datos con el servicio
    } else {
      console.warn("Formato de entrada no válido");
    }
  }

  onSalidaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.dateRecords[index].salida = value;
      this.updateDataStorage();
      this.shareDateRecords(); // Compartir datos con el servicio
    } else {
      console.warn("Formato de salida no válido");
    }
  }

  onObservationChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    this.dateRecords[index].observacion = value;
    this.updateObservation(index, value);
    this.shareDateRecords(); // Compartir datos con el servicio
  }

  isValidTimeFormat(value: string): boolean {
    const timeRegex = /^(?:[0-4]?[0-9]):[0-5][0-9]$/;
    const [hours, minutes] = value.split(':').map(Number);
    return timeRegex.test(value) && hours >= 0 && hours <= 48 && minutes >= 0 && minutes <= 59;
  }

  updateDataStorage(): void {
    this.dataStorageService.addFecha(this.dateRecords);
    console.log('Datos guardados en el servicio de almacenamiento:', this.dateRecords);
  }

  updateObservation(index: number, observacion: string): void {
    const observationEntry: ObservationEntry = {
      fecha: this.dateRecords[index].fecha,
      observacion: observacion
    };
    this.dataSharingService.updateObservationData([observationEntry]);
  }

  // Método para compartir todos los registros de fecha
  shareDateRecords(): void {
    this.dataSharingService.updateDateRecords(this.dateRecords); // Asume que tienes un método para actualizar registros
    console.log('Datos compartidos con el servicio de intercambio:', this.dateRecords);
  }
}