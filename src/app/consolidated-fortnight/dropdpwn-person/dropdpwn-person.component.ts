import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { NgFor, NgIf } from '@angular/common';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-dropdpwn-person',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './dropdpwn-person.component.html',
  styleUrl: './dropdpwn-person.component.css'
})

export class DropdownPersonComponent implements OnInit {
  dropdownOptions: string[] = [];
  selectedOption: string | null = null;
  columnIndices: number[] = Array.from({ length: 21 }, (_, i) => i * 3);

  constructor(private dataStorageService: DataStorageService, private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.loadDropdownOptions();
  }

  loadDropdownOptions(): void {
    this.dataStorageService.fetchColumnsData(this.columnIndices).subscribe(
      data => {
        this.dropdownOptions = data.filter(item => !!item).sort((a, b) => a.localeCompare(b));
      },
      error => {
        console.error('Error al cargar opciones del dropdown:', error);
      }
    );
  }

  onOptionSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;    
    this.dataSharingService.updatePerson(this.selectedOption);
  }
}