import { Component, OnInit } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';

@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css'],
  standalone: true,
  imports: [ NgFor, FormsModule ],
})

export class PersonnelManagerComponent implements OnInit {
  dropdownOptions: { value: string, label: string }[] = [];
  registros: { nombre: string }[] = [];
  selectedColumn: string = ''; // Variable para almacenar la columna seleccionada

  constructor(
    private sheetsService: SheetsService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService
  ) {}

  ngOnInit(): void {
    // Llenar dropdown con opciones disponibles desde SheetsService o cualquier fuente
    this.sheetsService.getDropdownOptions().subscribe(
      options => {
        this.dropdownOptions = options; // Asignar las opciones al dropdown
        if (options.length > 0) {
          // Seleccionar automáticamente la primera opción
          this.selectedColumn = options[0].value.toString(); // Convertir a cadena
          this.loadColumnData();
          

        }
        
      },
      error => {
        console.error('Error fetching dropdown options:', error);
      }
    );

    // Suscribirse a cambios en el índice de columna
    this.communicationService.columnIndex$.subscribe(
      columnIndex => {
        if (columnIndex !== null) {
          // Obtener la columna correspondiente al índice
          this.selectedColumn = `${columnIndex}`; // Asegurar que columnIndex sea tratado como string
          this.loadColumnData();
        }
      }
    );
  }

  // Método para cargar los datos de la columna seleccionada
  loadColumnData() {
    if (this.selectedColumn) {
      this.sheetsService.getColumnData(this.selectedColumn).subscribe(
        (data: string[]) => {
          this.registros = data.map(nombre => ({ nombre: nombre }));
        },
        (error: any) => {
          console.error('Error fetching column data:', error);
        }
      );
    }
  }

  formatoHora(event: any) {
    let inputVal = event.target.value;
    
    if (inputVal && !inputVal.includes(':') && inputVal.length === 2) {
      inputVal = inputVal.padEnd(2, '0') + ':00';
    }
  }
}