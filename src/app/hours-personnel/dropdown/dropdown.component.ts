import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { NgFor } from '@angular/common';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  standalone: true,
  imports: [NgFor],
  providers:[DataStorageService]
})

export class DropdownComponent implements OnInit {
  options: { value: string, label: string }[] = [];

  @Output() seleccionDropdown = new EventEmitter<number>(); 

  constructor(
    private sheetsService: SheetsService,
    private communicationService: CommunicationServiceDropdownPersonnelManagerService,
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService,
  ) {}

  ngOnInit(): void {
    

    this.sheetsService.getDropdownOptions().subscribe(
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
        this.communicationService.setColumnIndex(parseInt(selectedOption.value, 10));
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