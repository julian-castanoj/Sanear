import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { Subscription } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services/services.service';


@Component({
  selector: 'app-person-result-view',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './person-result-view.component.html',
  styleUrls: ['./person-result-view.component.css']
})

export class PersonResultViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @Input() selectedName: string = '';
  @Input() selectedDateRange: { startDate: string | null, endDate: string | null } = { startDate: null, endDate: null };

  allData: any[] = [];
  originalData: any[] = [];
  filteredData: any[] = [];
  displayedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  private subscription!: Subscription;
  totalHoursWorked: string = "0:00";  // Cambiado a string para mostrar en formato HH:MM

  constructor(private servicesService: ServicesService, private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.subscription = this.servicesService.getAllData().subscribe((data: any[]) => {
      this.originalData = data.map((item, index) => ({ ...item, id: item.id || index }));
      this.allData = [...this.originalData];
      this.updateFilteredData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['selectedName'] || changes['selectedDateRange']) {
      this.updateFilteredData();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  updateFilteredData(): void {
    if (!Array.isArray(this.allData)) {
      console.warn('All data is not available or not an array.');
      return;
    }

    this.filteredData = this.allData.filter(item => {
      const isInDateRange = this.isInDateRange(item.Fecha);
      const isNameMatch = this.selectedName ? item.Nombre.toLowerCase().includes(this.selectedName.toLowerCase()) : true;
      return isInDateRange && isNameMatch;
    });

    this.totalItems = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    this.updateDisplayedData();
    this.totalHoursWorked = this.calculateTotalHours(this.filteredData);
    this.dataStorageService.updateTotalHours(this.totalHoursWorked);  // Pasar como cadena
  }

  isInDateRange(date: string): boolean {
    const itemDate = new Date(date);
    const start = this.selectedDateRange.startDate ? new Date(this.selectedDateRange.startDate) : null;
    const end = this.selectedDateRange.endDate ? new Date(this.selectedDateRange.endDate) : null;
    return (!start || itemDate >= start) && (!end || itemDate <= end);
  }

  removeRow(index: number): void {
    const itemId = this.displayedData[index]?.id;

    if (itemId !== undefined) {
      this.filteredData = this.filteredData.filter(item => item.id !== itemId);
      this.updateDisplayedData();
      this.totalHoursWorked = this.calculateTotalHours(this.filteredData);
      this.dataStorageService.updateTotalHours(this.totalHoursWorked);  // Pasar como cadena
    }
  }

  updateDisplayedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  parseTime(timeString: string | null): { hours: number, minutes: number } | null {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return { hours, minutes };
  }

  calculateHoursDifference(start: { hours: number, minutes: number } | null, end: { hours: number, minutes: number } | null): string {
    if (!start || !end) return '00:00';

    let hoursDiff = end.hours - start.hours;
    let minutesDiff = end.minutes - start.minutes;

    if (minutesDiff < 0) {
      minutesDiff += 60;
      hoursDiff -= 1;
    }

    if (hoursDiff < 0) {
      hoursDiff += 24;
    }

    return `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}`;
  }

  calculateTotalHours(data: any[]): string {
    const result: { [person: string]: { hours: number, minutes: number } } = {};

    data.forEach(item => {
      const person = item.Nombre;
      const start = this.parseTime(item.Entrada);
      const end = this.parseTime(item.Salida);

      if (start && end) {
        const timeDifference = this.calculateHoursDifference(start, end);

        if (!result[person]) {
          result[person] = { hours: 0, minutes: 0 };
        }

        const [hours, minutes] = timeDifference.split(':').map(Number);
        result[person].hours += hours;
        result[person].minutes += minutes;

        // Convertir minutos a horas si es necesario
        if (result[person].minutes >= 60) {
          result[person].hours += Math.floor(result[person].minutes / 60);
          result[person].minutes = result[person].minutes % 60;
        }
      }
    });

    const total = result[this.selectedName] || { hours: 0, minutes: 0 };
    return `${total.hours.toString().padStart(2, '0')}:${total.minutes.toString().padStart(2, '0')}`;
  }
}