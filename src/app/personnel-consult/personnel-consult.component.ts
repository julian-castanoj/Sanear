import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../personnel-consult/services/services.service';
import { PersonSelectComponent } from './person-select/person-select.component';
import { PersonResultViewComponent } from './person-result-view/person-result-view.component';
import { DataRangeComponent } from './data-range/data-range.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personnel-consult',
  standalone: true,
  imports: [PersonSelectComponent,PersonResultViewComponent,DataRangeComponent,FormsModule], 
  templateUrl: './personnel-consult.component.html',
  styleUrls: ['./personnel-consult.component.css']
})

export class PersonnelConsultComponent implements OnInit {
  options: { value: string, label: string }[] = [];
  selectedNameData: any[] = [];
  dateRange = { startDate: null as string | null, endDate: null as string | null };
  selectedName: string = '';

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.servicesService.getAllData().subscribe(
      (data: any[]) => {
        this.options = this.getUniqueNames(data);
        this.selectedNameData = data; // Inicializar selectedNameData
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
        alert('Hubo un error al obtener los datos. Por favor, intenta de nuevo más tarde.');
      }
    );
  }

  onSelectionChange(selectedName: string): void {
    this.selectedName = selectedName;
    this.filterData();
  }

  onDateRangeChange(dateRange: { startDate: string | null, endDate: string | null }): void {
    this.dateRange = dateRange;
    this.filterData();
  }

  filterData(): void {
    this.servicesService.getAllData().subscribe(
      (data: any[]) => {
        this.selectedNameData = data.filter(item => {
          const isInDateRange = this.isInDateRange(item.Fecha);
          const isNameMatch = this.selectedName ? item.Nombre === this.selectedName : true;
          return isInDateRange && isNameMatch;
        });
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  isInDateRange(date: string): boolean {
    const itemDate = new Date(date);
    const start = this.dateRange.startDate ? new Date(this.dateRange.startDate) : null;
    const end = this.dateRange.endDate ? new Date(this.dateRange.endDate) : null;
    return (!start || itemDate >= start) && (!end || itemDate <= end);
  }

  getUniqueNames(data: any[]): { value: string, label: string }[] {
    const names = new Set<string>(data.map(item => item.Nombre));
    return Array.from(names).map(name => ({ value: name, label: name }));
  }
}