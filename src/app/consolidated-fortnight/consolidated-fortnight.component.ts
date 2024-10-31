import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../common-components/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { DropdownPersonComponent } from "../consolidated-fortnight/dropdpwn-person/dropdpwn-person.component";
import { DropdpwnInchargeComponent } from './dropdpwn-incharge/dropdpwn-incharge.component';
import { RangeToRecordComponent } from "./range-to-record/range-to-record.component";
import { DaysToRegisterComponent } from "./days-to-register/days-to-register.component";
import { DateObservationComponent } from '../consolidated-fortnight/date-observation/date-observation.component';
import { ObservationEntry } from "../consolidated-fortnight/services/data-sharing.service";
import { DataSharingService } from '../consolidated-fortnight/services/data-sharing.service';
import { DataStorageService } from './services/data-storage.service';

export interface DayRecord {
  fecha: string;
  entrada?: string | null;
  salida?: string | null;
  observacion?: string;
}

@Component({
  selector: 'app-consolidated-fortnight',
  imports: [NgIf, NgFor, FormsModule, DropdownPersonComponent, DropdpwnInchargeComponent, RangeToRecordComponent, DaysToRegisterComponent, DateObservationComponent],
  templateUrl: './consolidated-fortnight.component.html',
  styleUrls: ['./consolidated-fortnight.component.css'],
  standalone: true
})
export class ConsolidatedFortnightComponent implements OnInit {
  observationEntries: ObservationEntry[] = [];
  isAuthenticated = false;
  dateRecords: DayRecord[] = [];
  selectedDates: string[] = [];
  contratista: string | null = null;
  transportista: string = 'N/A';
  nombre: string | null = null;
  encargado: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService
  ) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.dataSharingService.person$.subscribe(person => {
      this.nombre = person;
    });

    this.dataSharingService.inCharge$.subscribe(inCharge => {
      this.contratista = inCharge;
    });

    this.dataSharingService.dateRecords$.subscribe(records => {
      this.dateRecords = records;
    });

    this.dataSharingService.getObservationDataObservable().subscribe((observations: ObservationEntry[]) => {
      this.observationEntries = observations;
    });
  }

  updateTable(dates: { date: string }[]) {
    this.dateRecords = dates.map(dateObj => ({
      fecha: dateObj.date,
      entrada: '',
      salida: ''
    }));
    this.selectedDates = dates.map(dateObj => dateObj.date);

  }

  onObservationChanged(updatedEntries: ObservationEntry[]) {
    this.observationEntries = updatedEntries;
  }

  addObservationEntry(selectedDate: string) {
    if (!this.observationEntries.some(entry => entry.fecha === selectedDate)) {
      this.observationEntries.push({ fecha: selectedDate, observacion: '' });
      this.dataSharingService.updateObservationData(this.observationEntries);
    } else {
    }
  }

  formatRecords(): any[] {
    const formattedRecords: any[] = [];
    this.dateRecords.forEach(record => {
      const fecha = record.fecha;
      const entrada = record.entrada || '0:00';
      const salida = record.salida || '0:00';
      const observacion = this.getObservationForDate(fecha);
      formattedRecords.push({
        Contratista: this.contratista,
        Transportista: this.transportista,
        Fecha: fecha,
        Nombre: this.nombre,
        Entrada: entrada,
        Salida: salida,
        Observaciones: observacion
      });
    });
    return formattedRecords;
  }

  getObservationForDate(date: string): string {
    const observation = this.observationEntries.find(obs => obs.fecha === date);
    return observation ? observation.observacion : '';
  }

  registerRecords(): void {
    if (!this.nombre) {
      this.showErrorAndAlert('Por favor, selecciona un nombre.');
      return;
    }
    if (this.dateRecords.length === 0) {
      this.showErrorAndAlert('Por favor, agrega al menos una fecha.');
      return;
    }
    const recordsToSend = this.formatRecords();
    this.dataStorageService.sendDataToGoogleSheets(recordsToSend).subscribe(
      response => {
        this.showSuccessAndAlert('Datos registrados correctamente.');
        this.clearFieldsAndReload();
      },
      error => {
        this.showErrorAndAlert('Error al registrar datos. Inténtalo de nuevo más tarde.');
      }
    );
  }
  private showErrorAndAlert(message: string): void {
    this.errorMessage = message;
    window.alert(message);
  }

  private showSuccessAndAlert(message: string): void {
    window.alert(message);
    this.errorMessage = null;
  }

  clearFieldsAndReload(): void {
    this.clearFields();
    this.dataSharingService.clearData();
    this.subscribeToData();
  }

  clearFields(): void {
    this.dateRecords = [];
    this.selectedDates = [];
    this.observationEntries = [];
  }

  logout() {
    this.authService.logout();
  }
}
