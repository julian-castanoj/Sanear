import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { NgIf } from '@angular/common';
import { PersonnelEntry } from '../services/data-sharing.service';
import { Router } from '@angular/router'; 

export interface ObservationEntry {
  nombre: string;
  observacion: string;
}

@Component({
  selector: 'app-to-register',
  standalone: true,
  imports: [NgIf],
  templateUrl: './to-register.component.html',
  styleUrls: ['./to-register.component.css']
})

export class ToRegisterComponent implements OnInit {
  dropdownSelection: string = '';
  transportistaMoto: string = '';
  selectedDate: Date | null = null;
  personnelEntries: PersonnelEntry[] = [];
  observation: ObservationEntry[] = [];
  errorMessage: string | null = null;

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService,
    private router: Router  // Añade Router al constructor
  ) { }

  ngOnInit(): void {
    this.loadDataFromServices();
  }

  loadDataFromServices(): void {
    const dropdownData = this.dataSharingService.getDropdownData();
    this.dropdownSelection = dropdownData ? dropdownData.label : '';
    this.transportistaMoto = this.dataSharingService.getCheckTransportData() || '';
    this.selectedDate = this.dataSharingService.getDataSelectData();
    this.observation = this.dataSharingService.getObservationData() || [];

    this.dataSharingService.getPersonnelManagerDataObservable().subscribe((data) => {
      this.personnelEntries = data.map((entry) => ({
        nombre: entry.nombre,
        entrada: entry.entrada || null,
        salida: entry.salida || null,
        observacion: entry.observacion ?? '*' // Ajustar el valor predeterminado
      }));
    });
  }

  register(): void {
    const dropdownData = this.dataSharingService.getDropdownData();
    const dropdownSelection = dropdownData ? dropdownData.label : '';
    const transportSelection = this.dataSharingService.getCheckTransportData() || '';
    const selectedDate = this.dataSharingService.getDataSelectData();
    const personnelEntries = this.dataSharingService.getPersonnelManagerData();
    let observations = this.dataSharingService.getObservationData() || [];
  
    if (observations.length === 0) {
      observations = personnelEntries.map(entry => ({ nombre: entry.nombre, observacion: '*' }));
    }
  
    const personnelEntriesWithObservations = personnelEntries.map(entry => ({
      nombre: entry.nombre,
      entrada: entry.entrada || null,
      salida: entry.salida || null,
      observacion: observations.find(o => o.nombre === entry.nombre)?.observacion ?? ''
    }));
  
    if (!dropdownSelection) {
      this.showErrorAndAlert('Por favor, selecciona un encargado.');
      return;
    }
  
    if (!transportSelection) {
      this.showErrorAndAlert('Por favor, selecciona si cuenta con transporte.');
      return;
    }
  
    if (!selectedDate) {
      this.showErrorAndAlert('Por favor, selecciona una fecha válida.');
      return;
    }
  
    if (personnelEntriesWithObservations.length === 0) {
      this.showErrorAndAlert('Por favor, agrega al menos una hora de entrada.');
      return;
    }
  
    if (personnelEntriesWithObservations.every(entry => !entry.nombre || entry.nombre.trim() === '')) {
      this.showErrorAndAlert('Por favor, ingresa al menos un nombre de personal.');
      return;
    }
  
    if (personnelEntriesWithObservations.every(entry => !entry.entrada || entry.entrada.trim() === '')) {
      this.showErrorAndAlert('Por favor, ingresa al menos una hora de entrada.');
      return;
    }
  
    this.dataStorageService.addData({
      dropdownSelection,
      transportSelection,
      selectedDate,
      names: personnelEntriesWithObservations,
      observation: observations
    });
  
    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      response => {
        console.log('Datos enviados a Google Sheets exitosamente:', response);
        this.showSuccessAndAlert('Datos registrados correctamente.');
        this.clearFieldsAndReload();
        this.router.navigate(['/']).then(success => {
          if (success) {
            console.log('Redirección exitosa a /primera-interfaz');
           
            window.location.reload();
          } else {
            console.log('Error en la redirección a /primera-interfaz');
          }
        });
      },
      error => {
        console.error('Error al registrar datos:', error);
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

  clearErrorMessage(): void {
    this.errorMessage = null;
  }

  clearFieldsAndReload(): void {
    this.clearFields();
    this.dataSharingService.clearData(); // Limpia los datos del servicio de compartición
    this.dataStorageService.clearStoredData(); // Limpia los datos almacenados
    // Puedes volver a cargar los datos si es necesario
    this.loadDataFromServices();
  }

  clearFields(): void {
    this.dropdownSelection = '';
    this.transportistaMoto = '';
    this.selectedDate = null;
    this.personnelEntries = [];
    this.observation = [];
  }

  addPersonnelEntry(): void {
    this.personnelEntries.push({ nombre: '', entrada: null, salida: null });
    this.observation.push({ nombre: '', observacion: '*' });
  }

  removePersonnelEntry(index: number): void {
    this.personnelEntries.splice(index, 1);
    this.observation.splice(index, 1);
  }
}