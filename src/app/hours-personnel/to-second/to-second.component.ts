import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';

export interface ObservationEntry {
  nombre: string;
  observacion: string;
}

@Component({
  selector: 'app-to-second',
  standalone: true,
  imports: [NgIf],
  templateUrl: './to-second.component.html',
  styleUrl: './to-second.component.css'
})

export class ToSecondComponent implements OnInit {
  dropdownSelection: string = '';
  transportistaMoto: string = '';
  selectedDate: Date | null = null;
  personnelEntries: { nombre: string; entrada: string | null; salida: string | null; }[] = [];
  observation: ObservationEntry[] = [];
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
    this.observation = this.dataSharingService.getObservationData() || [];
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

    let observation = this.dataSharingService.getObservationData() || [];
    if (observation.length === 0) {
      observation = this.personnelEntries.map(entry => ({ nombre: entry.nombre, observacion: '*' }));
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

    // Validar que al menos una entrada esté presente
    const hasAtLeastOneEntry = personnelEntries.some(entry => entry.entrada);
    if (!hasAtLeastOneEntry) {
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

    this.commonDataSharingService.setDropdownData(this.dataSharingService.getDropdownData()?.index || 0, dropdownSelection);
    this.commonDataStorageService.addDataCommon(dataToAdd).subscribe(
      () => {
        this.errorMessage = null;
        this.router.navigate(['/segunda-interfaz']).then(success => {
          if (success) {
            console.log('Redirección exitosa a /segunda-interfaz');
          } else {
            console.log('Error en la redirección a /segunda-interfaz');
          }
        });
      },
      (error: any) => {
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
    this.commonDataSharingService.clearData();
    window.location.reload();
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