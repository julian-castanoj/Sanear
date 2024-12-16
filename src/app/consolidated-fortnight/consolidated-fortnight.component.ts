import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class ConsolidatedFortnightComponent implements OnInit, OnDestroy {
  @ViewChild(DropdpwnInchargeComponent) dropdpwnInchargeComponent!: DropdpwnInchargeComponent;
  @ViewChild(DropdownPersonComponent) dropdownPersonComponent!: DropdownPersonComponent;
  @ViewChild(RangeToRecordComponent) rangeToRecordComponent!: RangeToRecordComponent;

  observationEntries: ObservationEntry[] = [];
  isAuthenticated = false;
  dateRecords: DayRecord[] = [];
  selectedDates: string[] = [];
  contratista: string | null = null;
  transportista: string = 'N/A';
  nombre: string | null = null;
  encargado: string | null = null;
  errorMessage: string | null = null;
  private renewTokenInterval: any;
  private routerSubscription: Subscription | null = null;
  

  constructor(
    private authService: AuthService,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.subscribeToData();


    
    // Configurar renovación periódica del token
    this.startTokenRenewal();

    this.router.events.subscribe((event: any) => {
      if (event.url && event.url !== '/consolidado') {
        sessionStorage.removeItem('token');
      }
    });
    console.log('Iniciando ConsolidatedFortnightComponent.');
  
    if (!this.authService.isAuthenticated()) {
      console.log('Usuario no autenticado. Redirigiendo al login.');
      this.router.navigate(['/login']);
    } else {
      console.log('Usuario autenticado. Continuando.');
      this.startTokenRenewal();
    }
  
  }

  onInChargeSelected(selectedInCharge: string): void {
    console.log('Encargado seleccionado:', selectedInCharge);
    this.contratista = selectedInCharge; // Guardar como contratista
    this.encargado = selectedInCharge;  // Guardar como encargado
    this.dataSharingService.updateInCharge(selectedInCharge); // Compartir con el servicio
  }

  ngOnDestroy() {
    // Limpiar intervalos y suscripciones al destruir el componente
    clearInterval(this.renewTokenInterval);
    this.routerSubscription?.unsubscribe();
  }

  private startTokenRenewal(): void {
    this.renewTokenInterval = setInterval(() => {
      this.renewToken();
    }, 20 * 60 * 1000); // Cada 4 minutos
  }

  private renewToken(): void {
    this.http.post('http://localhost:3000/renew-token', {}).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('token', response.token);
      },
      error: (err) => {
        console.error('Error renovando token:', err);
        this.logout(); // Cerrar sesión si no se puede renovar el token
      },
    });
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
        this.clearFieldsAndReload(); // Limpiar los campos
  
        // Llamar a clearSelection en ambos dropdowns
        if (this.dropdpwnInchargeComponent) {
          this.dropdpwnInchargeComponent.clearSelection();
        }
        if (this.dropdownPersonComponent) {
          this.dropdownPersonComponent.clearSelection();
        }
  
        // Limpiar las fechas en el RangeToRecordComponent
        if (this.rangeToRecordComponent) {
          this.rangeToRecordComponent.resetDates();
        }
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
    // Limpiar los campos relevantes
    this.clearFields();
    
    // Limpiar las variables del servicio
    this.dataSharingService.clearData();
  
    // Resuscribir las suscripciones
    this.subscribeToData();
  
    // Limpiar cualquier otro estado o variable
    this.contratista = null;
    this.nombre = null;
    this.encargado = null;
    this.errorMessage = null;
  }



  logout() {
    sessionStorage.removeItem('token');
    this.authService.logout();
    clearInterval(this.renewTokenInterval);
    this.router.navigate(['/login']);
  }

  clearFields(): void {
    // Limpiar registros de fechas y observaciones
    this.dateRecords = [];
    this.selectedDates = [];
    this.observationEntries = [];
  
    // Limpiar datos específicos del formulario
    this.contratista = null;
    this.transportista = 'N/A';
    this.nombre = null;
    this.encargado = null;
  
    // Limpiar cualquier otro campo si es necesario
  }

  
}