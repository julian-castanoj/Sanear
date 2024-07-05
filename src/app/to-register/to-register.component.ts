import { Component } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { SheetsService } from '../services/sheet.service';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-to-register',
  standalone: true,
  imports: [NgIf],
  templateUrl: './to-register.component.html',
  styleUrl: './to-register.component.css'
})

export class ToRegisterComponent implements OnInit {
  dropdownSelection: string = '';
  transportistaMoto: string = '';
  selectedDate: Date | null = null;
  personnelEntries: { nombre: string; entrada: string | null; salida: string | null; }[] = [];
  observation: string = '';
  errorMessage: string | null = null;

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.loadDataFromServices();
  }

  loadDataFromServices(): void {
    const dropdownData = this.dataSharingService.getDropdownData();
    this.dropdownSelection = dropdownData ? dropdownData.label : '';
    this.transportistaMoto = this.dataSharingService.getCheckTransportData() || '';
    this.selectedDate = this.dataSharingService.getDataSelectData();
    this.observation = this.dataSharingService.getObservationData() || '';
    
    this.dataSharingService.getPersonnelManagerDataObservable().subscribe(data => {
      this.personnelEntries = data.map(entry => ({
        nombre: entry.nombre,
        entrada: entry.entrada || null,
        salida: entry.salida || null
      }));
    });
  }

  register(): void {
    const dropdownData = this.dataSharingService.getDropdownData();
    const dropdownSelection = dropdownData ? dropdownData.label : '';
    const transportSelection = this.dataSharingService.getCheckTransportData() || '';
    const selectedDate = this.dataSharingService.getDataSelectData();
    let observation = this.dataSharingService.getObservationData(); 

    if (!observation) {
      observation = '*'; 
    }

    const personnelEntries = this.personnelEntries.map(entry => ({
      nombre: entry.nombre,
      entrada: entry.entrada || null,
      salida: entry.salida || null
    }));

    if (!dropdownSelection) {
      this.showErrorAndAlert('Por favor, selecciona un encargado.');
      return;
    }

    if (!transportSelection) {
      this.showErrorAndAlert('Por favor, selecciona si cuenta con transporte');
      return;
    }

    if (!selectedDate) {
      this.showErrorAndAlert('Por favor, selecciona una fecha válida.');
      return;
    }

    if (personnelEntries.length === 0) {
      this.showErrorAndAlert('Por favor, agrega al menos una hora de entrada ');
      return;
    }

    this.dataStorageService.addData({
      dropdownSelection,
      transportSelection,
      selectedDate,
      names: personnelEntries,
      observation
    });

    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      response => {
        
        this.showSuccessAndAlert('Datos registrados correctamente');
        this.clearFieldsAndReload(); // Limpia los campos después de un registro exitoso y recarga la página
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
    window.location.reload(); // Recarga la página después de limpiar los campos
  }

  clearFields(): void {
    this.dropdownSelection = '';
    this.transportistaMoto = '';
    this.selectedDate = null;
    this.personnelEntries = [];
    this.observation = '';
    this.dataSharingService.clearData(); 
  }

  addPersonnelEntry(): void {
    this.personnelEntries.push({ nombre: '', entrada: null, salida: null });
  }

  removePersonnelEntry(index: number): void {
    this.personnelEntries.splice(index, 1);
  }
} 