import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SheetsService } from '../../services/sheets.service'; // Asegúrate de importar el servicio correcto para obtener los datos
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataSharingService } from '../../services/data-sharing.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-driver-dropdown',
  standalone: true,
  imports: [NgFor,CommonModule],
  templateUrl: './vehicle-driver-dropdown.component.html',
  styleUrl: './vehicle-driver-dropdown.component.css'
})

export class VehicleDriverDropdownComponent implements OnInit {
  @Output() driverChange = new EventEmitter<{ columnIndex: number; label: string }>();
  options: { value: string, label: string }[] = [];
  @Input() currentLicensePlate!: string;

  constructor(private sheetsService: SheetsService, private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.currentLicensePlate = this.currentLicensePlate || 'FallbackPlate';
    this.sheetsService.getDriverDropdownOptions().subscribe({
      next: (options) => {
        this.options = options;
      },
      error: (error) => {
        console.error('Error fetching dropdown options:', error);
      }
    });
    const driverData = this.dataSharingService.getDriverData(this.currentLicensePlate);
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const selectedValue = target.value;
      const selectedOption = this.options.find(opt => opt.value === selectedValue);
      if (selectedOption) {
        const columnIndex = parseInt(selectedValue, 10);
        this.driverChange.emit({ columnIndex, label: selectedOption.label });
      } else {
        console.error('Selected value is not found in options:', selectedValue);
      }
    } else {
      console.error('Event target is not an HTMLSelectElement.');
    }
  }

  onDriverSelect(driver: string, columnIndex: number): void {
    this.driverChange.emit({ columnIndex, label: driver });
  }
}