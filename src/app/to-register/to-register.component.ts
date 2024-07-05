import { Component } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { SheetsService } from '../services/sheet.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-to-register',
  standalone: true,
  imports: [],
  templateUrl: './to-register.component.html',
  styleUrl: './to-register.component.css'
})

export class ToRegisterComponent implements OnInit {
  dropdownSelection: string = ''; // Cambiado a string para almacenar el label
  transportistaMoto: string = '';
  selectedDate: Date = new Date();
  personnelEntries: { nombre: string; entrada: string; salida: string; }[] = [];
  observation: string = '';

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.loadDataFromServices();
  }

  loadDataFromServices(): void {
    const dropdownData = this.dataSharingService.getDropdownData();
    this.dropdownSelection = dropdownData.label; // Obtener solo el label
    this.transportistaMoto = this.dataSharingService.getCheckTransportData();
    this.selectedDate = this.dataSharingService.getDataSelectData();
    this.personnelEntries = this.dataSharingService.getPersonnelManagerData();
    this.observation = this.dataSharingService.getObservationData();
  }

  register(): void {
    const dropdownData = this.dataSharingService.getDropdownData();
    const dropdownSelection = dropdownData.label; // Usar directamente el label
    const transportSelection = this.dataSharingService.getCheckTransportData();
    const selectedDate = this.dataSharingService.getDataSelectData();
    const personnelEntriesRaw = this.dataSharingService.getPersonnelManagerData();
    const observation = this.dataSharingService.getObservationData();

    const personnelEntriesFormatted = personnelEntriesRaw.map(entry => ({
      nombre: entry.nombre,
      entrada: entry.entrada || '',
      salida: entry.salida || ''
    }));

    console.log('Dropdown:', dropdownSelection);
    console.log('Seleccion transportista:', transportSelection);
    console.log('Selected Date:', selectedDate);
    console.log('Personnel Entries:', personnelEntriesFormatted);
    console.log('Observation Data:', observation);

    if (!dropdownSelection || !selectedDate || personnelEntriesFormatted.length === 0 || observation.trim() === '') {
      console.error('Datos inválidos, no se puede enviar a Google Sheets');
      return;
    }

    this.dataStorageService.addData({
      dropdownSelection,
      transportSelection,
      selectedDate,
      names: personnelEntriesFormatted,
      observation
    });

    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      response => {
        console.log('Datos registrados correctamente:', response);
        this.dataStorageService.clearData();
      },
      error => {
        console.error('Error al registrar datos:', error);
      }
    );
  }

  loadDataFromService(): void {
    this.personnelEntries = this.dataSharingService.getPersonnelManagerData().map(entry => ({
      nombre: entry.nombre,
      entrada: entry.entrada || '',
      salida: entry.salida || ''
    }));
    console.log('Loaded personnel entries:', this.personnelEntries);
  }
}