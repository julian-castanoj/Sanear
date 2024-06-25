import { Component, OnInit } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css'],
  standalone: true,
  imports: [ NgFor, FormsModule ],
})


export class PersonnelManagerComponent implements OnInit {
  dropdownOptions: { value: string, label: string }[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    // Agrega más opciones según sea necesario
  ];
  registros: { nombre: string, entrada: string, salida: string }[] = [];
  selectedColumn: string = ''; // Variable para almacenar la columna seleccionada

  constructor(private sheetsService: SheetsService) {}

  ngOnInit(): void {
    // Llenar dropdown con opciones disponibles
    this.sheetsService.getDropdownOptions().subscribe(
      options => {
        // Por ejemplo, asumamos que tienes un dropdown con opciones y el usuario selecciona una columna
        // En este ejemplo, se selecciona automáticamente la primera opción
        if (options.length > 0) {
          this.selectedColumn = options[0].value;
          this.loadColumnData();
        }
      },
      error => {
        console.error('Error fetching dropdown options:', error);
      }
    );
  }

  // Método para cargar los datos de la columna seleccionada
  loadColumnData() {
    if (this.selectedColumn) {
      this.sheetsService.getColumnData(this.selectedColumn).subscribe(
        (data: string[]) => {
          this.registros = data.map(nombre => ({ nombre: nombre, entrada: '', salida: '' }));
        },
        (error: any) => {
          console.error('Error fetching column data:', error);
        }
      );
    }
  }

  actualizarHoraEntrada(index: number, event: any) {
    this.registros[index].entrada = event.target.value;
  }

  actualizarHoraSalida(index: number, event: any) {
    this.registros[index].salida = event.target.value;
  }

  formatoHora(event: any) {
    let inputVal = event.target.value;
    
    if (inputVal && !inputVal.includes(':') && inputVal.length === 2) {
      inputVal = inputVal.padEnd(2, '0') + ':00';
    }
    
    this.registros.forEach(registro => {
      registro.entrada = inputVal; // Establecer la misma hora en todas las entradas al formatear
    });
  }
}