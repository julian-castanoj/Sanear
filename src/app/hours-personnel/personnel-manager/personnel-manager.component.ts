import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { SheetsService } from '../services/sheet.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

interface Entry {
  nombre: string;
  entrada: string;
  salida: string;
}
@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule]

})


export class PersonnelManagerComponent implements OnInit, OnDestroy {
  selectedIndex: number = -1;
  dataForColumn: string[] = []; // Inicialmente vacío
  entries: Entry[] = []; // Inicialmente vacío
  private columnIndexSubscription!: Subscription;
  private entriesSubscription!: Subscription;

  constructor(
    private dataSharingService: DataSharingService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService,
    private sheetsService: SheetsService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    // Limpiar datos al iniciar
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
          this.entries = this.dataForColumn.map(item => ({ nombre: item, entrada: '', salida: '' }));
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
      console.log('Invalid time format for entrada:', value);
    }
  }

  onSalidaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.entries[index].salida = value;
      this.dataSharingService.setPersonnelManagerData(this.entries);
      this.dataStorageService.addNames(this.entries);
    } else {
      console.log('Invalid time format for salida:', value);
    }
  }

  isValidTimeFormat(value: string): boolean {
    const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
    return timeRegex.test(value);
  }

  saveData(): void {
    this.dataStorageService.addNames(this.entries);
    console.log('Datos guardados en el servicio de almacenamiento:', this.entries);
  }
}

