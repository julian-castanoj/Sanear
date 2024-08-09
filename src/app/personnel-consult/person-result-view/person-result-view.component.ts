import { Component, Input, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service'; // Asegúrate de la ruta correcta
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-person-result-view',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './person-result-view.component.html',
  styleUrls: ['./person-result-view.component.css']
})

export class PersonResultViewComponent implements OnInit {
  @Input() data: any[] = []; // Datos filtrados por el nombre seleccionado
  filteredData: any[] = []; // Datos filtrados que se mostrarán en la tabla
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Número de ítems por página
  totalItems: number = 0; // Total de ítems
  totalPages: number = 0; // Total de páginas

  constructor(private servicesService: ServicesService) {} // Inyecta el servicio

  ngOnInit(): void {
    this.updateFilteredData();
  }

  ngOnChanges(): void {
    this.updateFilteredData();
  }

  // Actualiza los datos filtrados según la entrada
  updateFilteredData(): void {
    this.filteredData = this.data; // Usa los datos pasados como entrada
    this.totalItems = this.filteredData.length; // Actualiza el total de ítems
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calcula el total de páginas
    this.updateDisplayedData(); // Muestra los datos de la página actual
  }

  // Método para obtener los datos de la página actual
  getPaginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  // Actualiza los datos mostrados en la página actual
  updateDisplayedData(): void {
    this.getPaginatedData();
  }

  // Cambia a la siguiente página
  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.totalItems) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  // Cambia a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  // Cambia la página a la especificada
  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedData();
    }
  }
}
