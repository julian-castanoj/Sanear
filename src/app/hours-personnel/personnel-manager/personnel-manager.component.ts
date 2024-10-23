import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { SheetsService } from '../services/sheet.service';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService, PersonnelEntry, ObservationEntry } from '../services/data-sharing.service';

interface Entry {
  nombre: string;
  entrada: string;
  salida: string;
  observacion: string; // Añadir este campo
}

@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css']
})

export class PersonnelManagerComponent implements OnInit, OnDestroy {
  selectedIndex: number = -1;
  dataForColumn: string[] = [];
  entries: PersonnelEntry[] = [];
  private columnIndexSubscription!: Subscription;
  private entriesSubscription!: Subscription;

  constructor(
    private dataSharingService: DataSharingService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService,
    private sheetsService: SheetsService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.clearData();

    this.columnIndexSubscription = this.communicationService.columnIndex$.subscribe(index => {
      if (index !== null && index !== -1) {
        this.selectedIndex = index;
        this.loadDataForColumn(this.selectedIndex);
      } else {
        this.clearData();
      }
    });

    this.entriesSubscription = this.dataSharingService.getPersonnelManagerDataObservable().subscribe(entries => {
      this.entries = entries;
    });
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }

  private loadDataForColumn(index: number): void {
    this.sheetsService.getDataForColumn(index).subscribe(
      data => {
        if (data !== null && Array.isArray(data)) {
          this.dataForColumn = data.filter(item => item && item.trim().length > 0);
          this.entries = this.dataForColumn.map(item => ({ nombre: item, entrada: '', salida: '', observacion: '' }));
          this.dataSharingService.setPersonnelManagerData(this.entries); // Emitir datos iniciales
        } else {
          this.clearData();
          console.warn('Data received is null or not an array for column index:', index);
        }
      },
      error => {
        console.error('Error fetching data for column index:', index, error);
        this.clearData();
      }
    );
  }

  private clearData(): void {
    this.selectedIndex = -1;
    this.dataForColumn = [];
    this.entries = [];
  }

  private clearSubscriptions(): void {
    if (this.columnIndexSubscription) {
      this.columnIndexSubscription.unsubscribe();
    }
    if (this.entriesSubscription) {
      this.entriesSubscription.unsubscribe();
    }
  }

  onEntradaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.entries[index].entrada = value;
      this.dataSharingService.setPersonnelManagerData(this.entries);
      this.dataStorageService.addNames(this.entries);
    } else {
      console.error('Invalid entrada format:', value); // Manejo de error de formato
    }
  }

  onSalidaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.entries[index].salida = value;
      this.dataSharingService.setPersonnelManagerData(this.entries);
      this.dataStorageService.addNames(this.entries);
    } else {
      console.error('Invalid salida format:', value); // Manejo de error de formato
    }
  }

  isValidTimeFormat(value: string): boolean {
    // Actualización de la expresión regular para permitir horas de 00 a 48
    const timeRegex = /^(?:[01]?[0-9]|[2][0-3]|[2][4-9]|[3][0-9]|[4][0-8]):[0-5][0-9]$/;
    return timeRegex.test(value);
  }

  saveData(): void {
    this.dataStorageService.addNames(this.entries);
    console.log('Datos guardados en el servicio de almacenamiento:', this.entries);
  }

  handleObservationChanged(observations: ObservationEntry[]): void {
    this.dataSharingService.setObservationData(observations); // Actualiza las observaciones en el servicio
  }
}

