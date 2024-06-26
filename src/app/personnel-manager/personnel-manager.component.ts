import { Component, OnInit, OnDestroy } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css'],
  standalone: true,
  imports: [NgFor]
})

export class PersonnelManagerComponent implements OnInit, OnDestroy {
  registros: { nombre: string }[] = [];
  dropdownOptions: { value: string, label: string }[] = [];
  selectedColumn: string = '';
  private columnIndexSubscription!: Subscription;

  constructor(
    private sheetsService: SheetsService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService
  ) {}

  ngOnInit(): void {
    console.log('Initializing PersonnelManagerComponent...');

    // Cargar las opciones del dropdown
    this.sheetsService.getDropdownOptions().subscribe(
      (options: { value: string, label: string }[]) => {
        this.dropdownOptions = options;
        console.log('Dropdown options loaded:', this.dropdownOptions);
        if (options.length > 0) {
          this.selectedColumn = options[0].value;
          this.loadColumnData(this.selectedColumn);
        }
      },
      error => {
        console.error('Error fetching dropdown options:', error);
      }
    );

    // Suscribirse a los cambios en el índice de la columna
    this.columnIndexSubscription = this.communicationService.columnIndex$.subscribe(
      columnIndex => {
        console.log('Received columnIndex:', columnIndex);
        if (columnIndex !== null) {
          this.selectedColumn = columnIndex.toString();
          console.log('Selected column:', this.selectedColumn);
          this.loadColumnData(this.selectedColumn);
        }
      },
      error => {
        console.error('Error in columnIndex$ subscription:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.columnIndexSubscription) {
      this.columnIndexSubscription.unsubscribe();
    }
  }

  loadColumnData(selectedColumn: string) {
    console.log('Loading data for column:', selectedColumn);
    if (selectedColumn) {
      this.sheetsService.getColumnData(selectedColumn).subscribe(
        (data: string[]) => {
          this.registros = data.map(nombre => ({ nombre: nombre }));
          console.log('Column data loaded:', this.registros);
        },
        (error: any) => {
          console.error('Error fetching column data:', error);
        }
      );
    }
  }
}
