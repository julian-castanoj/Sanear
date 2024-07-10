import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SheetsService } from '../../services/sheets.service';
import { DataStorageService } from '../../services/data-storage.service';
import { DataSharingService } from '../../services/data-sharing.service'
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-vehicle-type-dropdown',
  standalone: true,
  imports: [NgFor],
  templateUrl: './vehicle-type-dropdown.component.html',
  styleUrl: './vehicle-type-dropdown.component.css'
})

export class VehicleTypeDropdownComponent implements OnInit {
  options: { value: string, label: string }[] = [];

  @Output() seleccionDropdown = new EventEmitter<number>(); 

  constructor(
    private sheetsService: SheetsService,
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.sheetsService.getVehicleDropdownOptions().subscribe(
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
        this.dataSharingService.setDropdownData(parseInt(selectedOption.value, 10), selectedOption.label);
        this.dataStorageService.addData({ dropdownSelection: parseInt(selectedOption.value, 10) });
        this.seleccionDropdown.emit(parseInt(selectedOption.value, 10));
      } else {
        console.error('Selected value is not found in options:', selectedValue);
      }
    } else {
      console.error('Event target is not an HTMLSelectElement.');
    }
  }
}