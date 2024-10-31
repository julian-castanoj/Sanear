import { Component } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { DataSharingService } from '../services/data-sharing.service';
import { OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-dropdpwn-incharge',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdpwn-incharge.component.html',
  styleUrl: './dropdpwn-incharge.component.css'
})

export class DropdpwnInchargeComponent implements OnInit {
  options: { value: string, label: string }[] = [];
  @Output() seleccionDropdown = new EventEmitter<string>();

  constructor(
    private sheetsService: SheetsService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.sheetsService.getDropdownOptions().subscribe(
      (data: { value: string, label: string }[]) => {
        this.options = data;
      },
      (error: any) => {
        console.error('Error al obtener datos del dropdown:', error);
      }
    );
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    const selectedOption = this.options.find(opt => opt.value === selectedValue);
    if (selectedOption) {
      const selectedLabel = selectedOption.label;
      this.seleccionDropdown.emit(selectedLabel);
      this.dataSharingService.updateInCharge(selectedLabel);
    } else {
      console.error('La opción seleccionada no se encontró en las opciones:', selectedValue);
    }
  }
}
