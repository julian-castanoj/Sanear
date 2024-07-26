import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';

@Component({
  selector: 'app-to-second',
  standalone: true,
  imports: [NgIf],
  templateUrl: './to-second.component.html',
  styleUrl: './to-second.component.css'
})


export class ToSecondComponent {
  dropdownSelection: string = '';
  transportistaMoto: string = '';
  selectedDate: Date | null = null;
  personnelEntries: { nombre: string; entrada: string | null; salida: string | null; }[] = [];
  observation: string = '';
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService,
    private commonDataSharingService: CommonDataSharingService,
    private commonDataStorageService: CommonDataStorageService
  ) { }

  ngOnInit(): void {
    this.loadDataFromServices();
  }

  loadDataFromServices(): void {
    this.dropdownSelection = this.dataSharingService.getDropdownData()?.label || '';
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

  validateAndStoreData(): void {
    const dropdownSelection = this.dataSharingService.getDropdownData()?.label || '';
    const transportSelection = this.dataSharingService.getCheckTransportData() || '';
    const selectedDate = this.dataSharingService.getDataSelectData();
    let observation = this.dataSharingService.getObservationData() || '';
  
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
      this.showErrorAndAlert('Por favor, selecciona si cuenta con transporte.');
      return;
    }
  
    if (!selectedDate) {
      this.showErrorAndAlert('Por favor, selecciona una fecha válida.');
      return;
    }
  
    if (personnelEntries.length === 0) {
      this.showErrorAndAlert('Por favor, agrega al menos una hora de entrada.');
      return;
    }
  
    const dataToAdd = {
      dropdownSelection,
      transportSelection,
      selectedDate,
      personnelEntries,
      observation
    };
  
    // Establece el valor en el servicio CommonDataSharingService
    this.commonDataSharingService.setDropdownData(this.dataSharingService.getDropdownData()?.index || 0, dropdownSelection);
  
    this.commonDataStorageService.addDataCommon(dataToAdd).subscribe(
      () => {
        console.log('Datos enviados a CommonDataStorageService correctamente.');
        this.dataStorageService.addDataCommon(dataToAdd).subscribe(
          () => {
            this.errorMessage = null;
            this.router.navigate(['/segunda-interfaz']);
          },
          (error: any) => {  // Specify the type of error here
            console.error('Error guardando datos:', error);
            this.showErrorAndAlert('Error guardando datos. Por favor, inténtalo de nuevo.');
          }
        );
      },
      (error: any) => {  // Specify the type of error here
        console.error('Error al enviar datos a CommonDataStorageService:', error);
        this.showErrorAndAlert('Error al enviar datos. Por favor, inténtalo de nuevo.');
      }
    );
  }

  private showErrorAndAlert(message: string): void {
    this.errorMessage = message;
    window.alert(message);
  }

  clearFieldsAndReload(): void {
    this.clearFields();
    window.location.reload();
    this.dropdownSelection = '';
    this.dataSharingService.clearData();
  }

  clearFields(): void {
    this.dropdownSelection = '';
    this.transportistaMoto = '';
    this.selectedDate = null;
    this.personnelEntries = [];
    this.observation = '';
    this.commonDataSharingService.clearData();
  }

  addPersonnelEntry(): void {
    this.personnelEntries.push({ nombre: '', entrada: null, salida: null });
  }

  removePersonnelEntry(index: number): void {
    this.personnelEntries.splice(index, 1);
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
      this.showErrorAndAlert('Por favor, selecciona si cuenta con transporte.');
      return;
    }
  
    if (!selectedDate) {
      this.showErrorAndAlert('Por favor, selecciona una fecha válida.');
      return;
    }
  
    if (personnelEntries.length === 0) {
      this.showErrorAndAlert('Por favor, agrega al menos una hora de entrada.');
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
        this.clearFieldsAndReload();
      },
      error => {
        console.error('Error al registrar datos:', error);
        this.showErrorAndAlert('Error al registrar datos. Inténtalo de nuevo más tarde.');
      }
    );
  } 
}
