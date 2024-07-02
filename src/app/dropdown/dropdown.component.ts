import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { NgFor } from '@angular/common';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  standalone: true,
  imports: [NgFor],
})

export class DropdownComponent implements OnInit {
  options: { value: string, label: string }[] = [];

  @Output() seleccionDropdown = new EventEmitter<number>(); 

  constructor(
    private sheetsService: SheetsService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService,
    private dataStorageService: DataStorageService,
  ) {}

  ngOnInit(): void {
    console.log('Initializing DropdownComponent...');

    this.sheetsService.getDropdownOptions().subscribe(
      (data: { value: string, label: string }[]) => {
        this.options = data;
        console.log('Dropdown options loaded:', this.options);
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
      const index = parseInt(selectedValue, 10);
      if (!isNaN(index)) {
        console.log('Dropdown selection:', index);
        this.communicationService.setColumnIndex(index); 
        this.dataStorageService.addData({ dropdownSelection: index }); // Agregar dato al servicio
        this.seleccionDropdown.emit(index);
      } else {
        console.error('Selected value is not a valid number:', selectedValue);
      }
    } else {
      console.error('Event target is not an HTMLSelectElement.');
    }
  }
}