import { Component } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { SheetsService } from '../services/sheet.service';

@Component({
  selector: 'app-to-register',
  standalone: true,
  imports: [],
  templateUrl: './to-register.component.html',
  styleUrl: './to-register.component.css'
})

export class ToRegisterComponent {

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  register(): void {
    const dropdownSelection = this.dataSharingService.getDropdownData();
    const transportSelection = this.dataSharingService.getCheckTransportData();
    const selectedDate = this.dataSharingService.getDataSelectData();
    const personnelEntries = this.dataSharingService.getPersonnelManagerData();
    const observation = this.dataSharingService.getObservationData();

    if (dropdownSelection === undefined || selectedDate === undefined || personnelEntries.length === 0 || observation.trim() === '') {
      console.log("Dropdown: " + dropdownSelection);
      console.log("selected Date: " + selectedDate);
      console.log("Personnel Entries: ", personnelEntries);
      console.log("Observation Data: " + observation);
      console.error('Datos inválidos, no se puede enviar a Google Sheets');
      return;
    }

    this.dataStorageService.addData({
      dropdownSelection,
      transportSelection,
      selectedDate,
      names: personnelEntries.map(name => ({
        nombre: name.nombre,
        entrada: '',
        salida: ''
      })),
      observation
    });

    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      response => {
        console.log('Datos registrados correctamente:', response);
        this.dataStorageService.clearData();
        // Aquí podrías mostrar un mensaje de éxito al usuario si lo deseas
      },
      error => {
        console.error('Error al registrar datos:', error);
        // Opcionalmente, manejar la visualización de errores o lógica de reintento
      }
    );
  }
}