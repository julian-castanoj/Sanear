import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../personnel-consult/services/services.service';
import { PersonSelectComponent } from './person-select/person-select.component';
import { PersonResultViewComponent } from './person-result-view/person-result-view.component';

@Component({
  selector: 'app-personnel-consult',
  standalone: true,
  imports: [PersonSelectComponent,PersonResultViewComponent], 
  templateUrl: './personnel-consult.component.html',
  styleUrls: ['./personnel-consult.component.css']
})

export class PersonnelConsultComponent implements OnInit {
  options: { value: string, label: string }[] = [];
  selectedNameData: any[] = [];

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.servicesService.getAllData().subscribe(
      (data: any[]) => {
        this.options = this.getUniqueNames(data);
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
        alert('Hubo un error al obtener los datos. Por favor, intenta de nuevo más tarde.');
      }
    );
  }

  onSelectionChange(selectedName: string): void {
    this.servicesService.getAllData().subscribe(
      (data: any[]) => {
        this.selectedNameData = data.filter(item => item.Nombre === selectedName);
      },
      (error: any) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  getUniqueNames(data: any[]): { value: string, label: string }[] {
    const names = new Set<string>(data.map(item => item.Nombre));
    return Array.from(names).map(name => ({ value: name, label: name }));
  }
}