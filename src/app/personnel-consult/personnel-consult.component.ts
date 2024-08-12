import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../personnel-consult/services/services.service';
import { PersonSelectComponent } from './person-select/person-select.component';
import { PersonResultViewComponent } from './person-result-view/person-result-view.component';
import { DataRangeComponent } from './data-range/data-range.component';
import { FormsModule } from '@angular/forms';
import { PersonHoursWorkComponent } from './person-hours-work/person-hours-work.component';
import { DataStorageService } from '../personnel-consult/services/data-storage.service';

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

  constructor(
    private servicesService: ServicesService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.servicesService.getAllData().subscribe(
      (data: any[]) => {
        this.selectedNameData = data;
        this.options = this.getUniqueNames(data);
        this.updateFilteredData(); // Inicializa los datos filtrados y la paginación
        this.dataStorageService.updateTotalHours(this.calculateTotalHours(this.selectedNameData)); // Inicializa las horas totales
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
        alert('Hubo un error al obtener los datos. Por favor, intenta de nuevo más tarde.');
      }
    );
  }

  onSelectionChange(selectedName: string): void {
    this.selectedName = selectedName;
    this.currentPage = 1; // Resetear a la primera página al cambiar la selección
    this.updateFilteredData();
  }

  onDateRangeChange(dateRange: { startDate: string | null, endDate: string | null }): void {
    this.dateRange = dateRange;
    this.currentPage = 1; // Resetear a la primera página al cambiar el rango de fechas
    this.updateFilteredData();
  }

  updateFilteredData(): void {
    let filteredData = this.selectedNameData.filter(item => {
      const isInDateRange = this.isInDateRange(item.Fecha);
      const isNameMatch = this.selectedName ? item.Nombre === this.selectedName : true;
      return isInDateRange && isNameMatch;
    });

    // Actualizar datos filtrados y paginación
    this.totalItems = filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Actualizar datos mostrados en la página actual
    this.updateDisplayedData(filteredData);

    // Actualizar horas totales
    this.dataStorageService.updateTotalHours(this.calculateTotalHours(filteredData));
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

  calculateTotalHours(data: any[]): number {
    return data.reduce((sum, item) => {
      const start = this.parseTime(item.Entrada);
      const end = this.parseTime(item.Salida);
      return sum + this.calculateHoursDifference(start, end);
    }, 0);
  }

  parseTime(timeString: string): { hours: number, minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  calculateHoursDifference(start: { hours: number, minutes: number }, end: { hours: number, minutes: number }): number {
    let hoursDiff = end.hours - start.hours;
    let minutesDiff = end.minutes - start.minutes;

    if (minutesDiff < 0) {
      minutesDiff += 60;
      hoursDiff -= 1;
    }

    return hoursDiff + (minutesDiff / 60);
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
}