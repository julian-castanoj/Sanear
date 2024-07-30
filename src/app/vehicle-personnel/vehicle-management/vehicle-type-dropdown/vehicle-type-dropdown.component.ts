import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SheetsService } from '../../services/sheets.service';
import { DataStorageService } from '../../services/data-storage.service';
import { DataSharingService } from '../../services/data-sharing.service'
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-vehicle-type-dropdown',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './vehicle-type-dropdown.component.html',
  styleUrl: './vehicle-type-dropdown.component.css'
})

export class VehicleTypeDropdownComponent implements OnInit {
  options: { value: string, label: string }[] = [];
  defaultLabel: string = "Vehículo";

  @Output() seleccionDropdown = new EventEmitter<{ columnIndex: number, label: string }>();

  constructor(
    private sheetsService: SheetsService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.sheetsService.getVehicleDropdownOptions().subscribe(
      (data: { value: string, label: string }[]) => {
        this.options = data;
        this.dataSharingService.saveLabels([this.defaultLabel, ...this.options.map(opt => opt.label)]);
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
        const columnIndex = this.options.indexOf(selectedOption);
        // Aquí columnIndex se asocia con tipoCarroIndex
        this.seleccionDropdown.emit({ columnIndex, label: selectedOption.label });
      }
    }
  }
}