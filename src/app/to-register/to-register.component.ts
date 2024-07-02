import { Component } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-to-register',
  standalone: true,
  imports: [],
  templateUrl: './to-register.component.html',
  styleUrl: './to-register.component.css'
})

export class ToRegisterComponent {

  constructor(private dataStorageService: DataStorageService) {}

  register(): void {
    console.log(this.dataStorageService);
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

  // Métodos para agregar datos individuales
  addTransportSelection(transportSelection: string): void {
    this.dataStorageService.addData({ transportSelection });
  }

  addSelectedDate(selectedDate: string): void {
    this.dataStorageService.addData({ selectedDate });
  }

  addDropdownSelection(dropdownSelection: number): void {
    this.dataStorageService.addData({ dropdownSelection });
  }

  addObservation(observation: string): void {
    this.dataStorageService.addData({ observation });
  }

  addNames(names: { nombre: string, entrada: string, salida: string }[]): void {
    this.dataStorageService.addData({ names });
  }
}