import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { NgFor, NgIf } from '@angular/common';
import { DataSharingService } from '../services/data-sharing.service';

interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-dropdpwn-person',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './dropdpwn-person.component.html',
  styleUrls: ['./dropdpwn-person.component.css']
})

export class DropdownPersonComponent implements OnInit {
  dropdownOptions: string[] = [];
  selectedOption: string | null = null;
  columnIndices: number[] = Array.from({ length: 21 }, (_, i) => i * 3);
  errorMessage: string = '';
  options: { value: string; label: string }[] = [];

  @ViewChild('personSelect') personSelect!: ElementRef<HTMLSelectElement>;

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.loadDropdownOptions();
  }


  loadDropdownOptions(): void {
    this.dataStorageService.getFilteredColumns(this.columnIndices).subscribe(
      (data) => {
        if (data && Array.isArray(data.data)) {
          // Mapeamos los datos para crear las opciones
          this.options = data.data
            .map((item: string) => ({
              value: item,
              label: item // Si solo quieres mostrar el nombre, este puede ser el label
            }))
            .filter((option: DropdownOption) => option.value.trim() !== '') // Usamos la interfaz
            .sort((a: DropdownOption, b: DropdownOption) => a.value.localeCompare(b.value)); // Ordenamos alfabéticamente
  
          console.log('Datos recibidos correctamente:', this.options);
        } else {
          this.errorMessage = 'Respuesta inesperada, no es un arreglo';
          console.error('Respuesta inesperada:', data);
        }
      },
      (error) => {
        console.error('Error al cargar opciones del dropdown:', error);
        this.errorMessage = 'Error al cargar las opciones del dropdown';
      }
    );
  }


  // Método para manejar la selección de opciones del dropdown
  onOptionSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
    // Actualiza la selección a través del servicio de compartición de datos
    this.dataSharingService.updatePerson(this.selectedOption);
  }

  // Método para limpiar la selección
  clearSelection(): void {
    if (this.personSelect && this.personSelect.nativeElement) {
      this.personSelect.nativeElement.selectedIndex = 0;
      this.selectedOption = null;
    }
  }
}