import { Component } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-check-transport',
  standalone: true,
  imports: [],
  templateUrl: './check-transport.component.html',
  styleUrl: './check-transport.component.css'
})

export class CheckTransportComponent {
  transportistaMoto: string = '';

  constructor(private dataStorageService: DataStorageService) {}

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.transportistaMoto = selectElement.value;
    this.dataStorageService.addTransportSelection(this.transportistaMoto);
    console.log('Seleccionado:', this.transportistaMoto);
  }
}