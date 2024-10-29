import { Component } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dropdpwn-incharge',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdpwn-incharge.component.html',
  styleUrl: './dropdpwn-incharge.component.css'
})
export class DropdpwnInchargeComponent {
  options: { value: string, label: string }[] = [];

  @Output() seleccionDropdown = new EventEmitter<number>(); 

  constructor(private sheetsService: SheetsService) {}

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
        this.seleccionDropdown.emit(parseInt(selectedOption.value, 10));
      } else {
        console.error('Selected value is not found in options:', selectedValue);
      }
    }
  }
}