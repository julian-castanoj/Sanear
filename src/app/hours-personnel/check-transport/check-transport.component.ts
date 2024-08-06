import { Component } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-check-transport',
  standalone: true,
  imports: [],
  templateUrl: './check-transport.component.html',
  styleUrl: './check-transport.component.css'
})

export class CheckTransportComponent {
  transportistaMoto: string = '';

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.transportistaMoto = selectElement.value;
    this.dataStorageService.addTransportSelection(this.transportistaMoto);
    this.dataSharingService.setCheckTransportData(this.transportistaMoto);
    console.log('Transportista Moto selected:', this.transportistaMoto); // Debugging
  }
}