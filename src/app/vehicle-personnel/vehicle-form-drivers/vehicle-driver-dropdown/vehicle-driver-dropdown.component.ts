import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SheetsService } from '../../services/sheets.service'; // Asegúrate de importar el servicio correcto para obtener los datos
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-driver-dropdown',
  standalone: true,
  imports: [NgFor,CommonModule],
  templateUrl: './vehicle-driver-dropdown.component.html',
  styleUrl: './vehicle-driver-dropdown.component.css'
})

export class VehicleDriverDropdownComponent implements OnInit {
  options: { value: string, label: string }[] = [];
  @Output() seleccionDropdown = new EventEmitter<{ columnIndex: number, label: string }>(); // Emitir objeto con columnIndex y label

  constructor(private sheetsService: SheetsService) {}

  ngOnInit(): void {
    this.sheetsService.getDriverDropdownOptions().subscribe(
      (data: { value: string, label: string }[]) => {
        this.options = data;
      },
      (error: any) => {
        console.error('Error fetching dropdown data:', error);
      }
    );
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const selectedValue = target.value;
      const selectedOption = this.options.find(opt => opt.value === selectedValue);
      if (selectedOption) {
        const columnIndex = parseInt(selectedOption.value, 10);
        this.seleccionDropdown.emit({ columnIndex, label: selectedOption.label }); // Emitir objeto con columnIndex y label
      } else {
        console.error('Selected value is not found in options:', selectedValue);
      }
    } else {
      console.error('Event target is not an HTMLSelectElement.');
    }
  }
}
