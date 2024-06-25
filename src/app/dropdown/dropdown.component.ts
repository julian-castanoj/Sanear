import { Component, OnInit } from '@angular/core';
import { SheetsService } from '../services/sheet.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,  
  imports: [CommonModule, NgFor],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  options: { value: string, label: string }[] = [];

  constructor(private sheetsService: SheetsService) {}

  ngOnInit(): void {
    this.sheetsService.getDropdown().subscribe(
      (data: { value: string, label: string }[]) => {
        this.options = data;
      },
      (error: any) => {
        console.error('Error fetching dropdown data:', error);
      }
    );
  }

  

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    console.log('Selected value:', selectElement.value);
  }
}
