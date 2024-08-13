import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../personnel-consult/services/services.service';
import { PersonSelectComponent } from './person-select/person-select.component';
import { PersonResultViewComponent } from './person-result-view/person-result-view.component';
import { DataRangeComponent } from './data-range/data-range.component';
import { FormsModule } from '@angular/forms';
import { PersonHoursWorkComponent } from './person-hours-work/person-hours-work.component';
import { DataStorageService } from '../personnel-consult/services/data-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personnel-consult',
  standalone: true,
  imports: [PersonSelectComponent, PersonResultViewComponent, DataRangeComponent, FormsModule, PersonHoursWorkComponent,FormsModule], 
  templateUrl: './personnel-consult.component.html',
  styleUrls: ['./personnel-consult.component.css']
})

export class PersonnelConsultComponent implements OnInit {
  options: { value: string, label: string }[] = [];
  selectedNameData: any[] = [];
  dateRange = { startDate: null as string | null, endDate: null as string | null };
  selectedName: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  filteredData: any[] = [];
  totalHoursWorked: string = "0:00";  // Usar formato HH:MM
  isLoading: boolean = false;

  constructor(
    private servicesService: ServicesService,
    private dataStorageService: DataStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.dataStorageService.dateRange$.subscribe(dateRange => {
      this.dateRange = dateRange;
      this.applyFilters();
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.servicesService.getAllData().subscribe(
      (data: any[]) => {
        this.selectedNameData = data;
        this.options = this.getUniqueNames(data);
        this.updateFilteredData();
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
        alert('Hubo un error al obtener los datos. Por favor, intenta de nuevo más tarde.');
        this.isLoading = false;
      }
    );
  }

  onSelectionChange(selectedName: string): void {
    this.selectedName = selectedName;
    this.currentPage = 1;
    this.applyFilters();
  }

  onDateRangeChange(dateRange: { startDate: string | null, endDate: string | null }): void {
    this.dateRange = dateRange;
    this.dataStorageService.updateDateRange(dateRange);
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.updateFilteredData();
      this.isLoading = false;
    }, 300);
  }

  updateFilteredData(): void {
    let filteredData = this.selectedNameData.filter(item => {
      const isInDateRange = this.isInDateRange(item.Fecha);
      const isNameMatch = this.selectedName ? item.Nombre === this.selectedName : true;
      return isInDateRange && isNameMatch;
    });

    this.totalItems = filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData(filteredData);

    this.totalHoursWorked = this.calculateTotalHours(filteredData);  // `totalHoursWorked` en formato HH:MM
    this.dataStorageService.updateTotalHours(this.totalHoursWorked);  // `totalHoursWorked` como cadena
  }

  updateDisplayedData(filteredData: any[]): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredData = filteredData.slice(startIndex, endIndex);
  }

  isInDateRange(date: string): boolean {
    const itemDate = new Date(date);
    const start = this.dateRange.startDate ? new Date(this.dateRange.startDate) : null;
    const end = this.dateRange.endDate ? new Date(this.dateRange.endDate) : null;
    return (!start || itemDate >= start) && (!end || itemDate <= end);
  }

  calculateTotalHours(data: any[]): string {
    const totalMinutes = data.reduce((sum, item) => {
      const start = this.parseTime(item.Entrada);
      const end = this.parseTime(item.Salida);

      if (!start || !end) {
        return sum;
      }

      return sum + this.calculateHoursDifference(start, end);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  parseTime(timeString: string | null): { hours: number, minutes: number } | null {
    if (!timeString) {
      return null;
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    return { hours, minutes };
  }

  calculateHoursDifference(start: { hours: number, minutes: number }, end: { hours: number, minutes: number }): number {
    let hoursDiff = end.hours - start.hours;
    let minutesDiff = end.minutes - start.minutes;

    if (minutesDiff < 0) {
      minutesDiff += 60;
      hoursDiff -= 1;
    }

    return hoursDiff * 60 + minutesDiff;  // Devuelve minutos totales
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredData();
    }
  }

  getUniqueNames(data: any[]): { value: string, label: string }[] {
    const names = [...new Set(data.map(item => item.Nombre))];
    return names.map(name => ({ value: name, label: name }));
  }

  navigateToFirstInterface(): void {
    this.router.navigate(['/primera-interfaz']);
  }
}