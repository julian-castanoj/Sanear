import { Component, OnInit } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css'],
  standalone: true,
  imports: [CommonModule, NgFor],
})

export class PersonnelManagerComponent implements OnInit {
  registros: { nombre: string, entrada: string, salida: string }[] = [];

  constructor(
    private sheetsService: SheetsService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService
  ) {}

  ngOnInit(): void {
    this.communicationService.columnIndex$.subscribe(columnIndex => {
      if (columnIndex !== null) {
        this.loadColumnData(columnIndex);
      }
    });
  }

  loadColumnData(columnIndex: number): void {
    const columnName = `columna${columnIndex}`;
    this.sheetsService.getColumnData(columnName).subscribe(
      data => {
        this.registros = data.map(nombre => ({ nombre: nombre, entrada: '', salida: '' }));
      },
      error => {
        console.error('Error fetching column data:', error);
      }
    );
  }

  actualizarHoraEntrada(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valor = inputElement.value;
    if (this.registros[index]) {
      this.registros[index].entrada = valor;
    }
  }

  actualizarHoraSalida(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valor = inputElement.value;
    if (this.registros[index]) {
      this.registros[index].salida = valor;
    }
  }

  formatoHora(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputVal = inputElement.value;

    if (inputVal && !inputVal.includes(':') && inputVal.length === 2) {
      inputVal = inputVal.padEnd(2, '0') + ':00';
    }

    inputElement.value = inputVal;
  }
}