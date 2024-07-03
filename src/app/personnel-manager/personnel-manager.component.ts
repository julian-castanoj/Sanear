import { Component, OnDestroy, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { SheetsService } from '../services/sheet.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../services/data-storage.service';

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
  imports: [NgIf, NgFor]

})

export class PersonnelManagerComponent implements OnDestroy, AfterViewInit {
  @Output() save = new EventEmitter<Entry[]>();

  selectedIndex: number = -1;
  dataForColumn: string[] = [];
  entries: Entry[] = [];
  private columnIndexSubscription: Subscription;

  constructor(
    private communicationService: CommunicationServiceDropdownPersonnelManagerService,
    private sheetsService: SheetsService,
    private dataStorageService: DataStorageService
  ) {
    this.columnIndexSubscription = this.communicationService.columnIndex$.subscribe(index => {
      if (index !== null) {
        this.selectedIndex = index;
        this.loadDataForColumn(index);
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadDataForColumn(this.selectedIndex);
  }

  ngOnDestroy(): void {
    this.columnIndexSubscription.unsubscribe();
  }

  private loadDataForColumn(index: number): void {
    this.sheetsService.getDataForColumn(index).subscribe(
      data => {
        if (data !== null) {
          this.dataForColumn = data.filter(item => item && item.trim().length > 0);
          this.entries = this.dataForColumn.map(item => ({ nombre: item, entrada: '', salida: '' }));
          console.log('Data for column index:', index);
          console.log(this.dataForColumn); 
        } else {
          this.dataForColumn = [];
          this.entries = [];
          console.warn('Data received is null for column index:', index);
        }
      },
      error => {
        console.error('Error fetching data for column index:', index, error);
        this.dataForColumn = [];
        this.entries = [];
      }
    );
  }

  onEntradaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.entries[index].entrada = value;
    } else {
      // Handle invalid format (e.g., display error message, reset input, etc.)
      console.log('Invalid time format for entrada:', value);
    }
  }

  onSalidaChange(event: Event, index: number): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isValidTimeFormat(value)) {
      this.entries[index].salida = value;
    } else {
      // Handle invalid format (e.g., display error message, reset input, etc.)
      console.log('Invalid time format for salida:', value);
    }
  }

  isValidTimeFormat(value: string): boolean {
    // Regular expression to validate HH:mm format
    const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
    return timeRegex.test(value);
  }

  saveData(): void {
    this.dataStorageService.addData({ personnelEntries: this.entries });
    console.log('Entries to save:', this.entries);
  }
}