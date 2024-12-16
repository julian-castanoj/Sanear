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
        // Extraemos el número de col-X
        const columnNumber = parseInt(selectedOption.value.split('-')[1], 10);
  
        // Calcular el índice dinámicamente
        const selectedIndex = (columnNumber - 1) * 3;  // Asumiendo que el índice aumenta de 3 en 3
  
        if (!isNaN(selectedIndex)) {  // Verificamos que el índice es válido
          this.dataSharingService.setDropdownData(selectedIndex, selectedOption.label);
          this.communicationService.setColumnIndex(selectedIndex);
          this.dataStorageService.addData({ dropdownSelection: selectedIndex });
          this.seleccionDropdown.emit(selectedIndex);
        } else {
          console.error('Índice calculado no válido para la columna:', selectedOption.value);
        }
      } else {
        console.error('El valor seleccionado no se encuentra en las opciones:', selectedValue);
      }
    } else {
      console.error('El target del evento no es un HTMLSelectElement.');
    }
  }
}