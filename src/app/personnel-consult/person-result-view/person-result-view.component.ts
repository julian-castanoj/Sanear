import { Component, Input, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service'; // Asegúrate de la ruta correcta
import { NgFor, NgIf } from '@angular/common';
import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-person-result-view',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './person-result-view.component.html',
  styleUrls: ['./person-result-view.component.css']
})

export class PersonResultViewComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() selectedDateRange: { startDate: string | null, endDate: string | null } = { startDate: null, endDate: null };
  @Input() selectedName: string = '';
  
  filteredData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.updateFilteredData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['selectedDateRange'] || changes['selectedName']) {
      this.updateFilteredData();
    }
  }

  updateFilteredData(): void {
    this.filteredData = [...this.data]; // Crear una copia para manipular
    this.filterByDate();
    this.filterByName();
    this.totalItems = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }

  filterByDate(): void {
    const { startDate, endDate } = this.selectedDateRange;
    if (startDate && endDate) {
      this.filteredData = this.filteredData.filter(row => {
        const rowDate = new Date(row.Fecha);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return rowDate >= start && rowDate <= end;
      });
    } else if (startDate) {
      this.filteredData = this.filteredData.filter(row => {
        const rowDate = new Date(row.Fecha);
        const start = new Date(startDate);
        return rowDate >= start;
      });
    } else if (endDate) {
      this.filteredData = this.filteredData.filter(row => {
        const rowDate = new Date(row.Fecha);
        const end = new Date(endDate);
        return rowDate <= end;
      });
    }
  }

  filterByName(): void {
    if (this.selectedName) {
      this.filteredData = this.filteredData.filter(row => row.Nombre === this.selectedName);
    }
  }

  getPaginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  updateDisplayedData(): void {
    this.filteredData = this.getPaginatedData();
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.totalItems) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedData();
    }
  }

  removeRow(index: number): void {
    // Remove the row from filteredData
    this.filteredData.splice(index, 1);
    this.totalItems = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }
}
