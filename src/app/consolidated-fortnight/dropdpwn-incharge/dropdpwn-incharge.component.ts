  import { Component, ViewChild, ElementRef } from '@angular/core';
  import { SheetsService } from '../services/sheet.service';
  import { Output } from '@angular/core';
  import { EventEmitter } from '@angular/core';
  import { NgFor } from '@angular/common';
  import { DataSharingService } from '../services/data-sharing.service';
  import { OnInit } from '@angular/core';
  import { DataStorageService } from '../services/data-storage.service';

  @Component({
    selector: 'app-dropdpwn-incharge',
    standalone: true,
    imports: [NgFor],
    templateUrl: './dropdpwn-incharge.component.html',
    styleUrl: './dropdpwn-incharge.component.css'
  })

  export class DropdpwnInchargeComponent implements OnInit {
    options: { value: string, label: string }[] = [];
    @Output() seleccionDropdown = new EventEmitter<string>();  // Emitir el valor seleccionado
    @ViewChild('miSelect') miSelect!: ElementRef;
  
    constructor(private sheetsService: SheetsService, private dataSharingService: DataSharingService) {}
  
    ngOnInit(): void {
      this.sheetsService.getDropdownOptions().subscribe(
        (data: { value: string, label: string }[]) => {
          console.log('Datos recibidos del backend:', data);
  
          if (data.length > 0) {
            this.options = data; // Ya recibimos el formato adecuado
            console.log('Opciones transformadas:', this.options);
          } else {
            console.warn('El arreglo recibido está vacío.');
          }
        },
        error => {
          console.error('Error al obtener datos del dropdown:', error);
        }
      );
    }
  
    // Captura la opción seleccionada
    onSelectionChange(event: Event): void {
      const selectedValue = (event.target as HTMLSelectElement).value;
      const selectedOption = this.options.find(option => option.value === selectedValue);
      if (selectedOption) {
        console.log('Opción seleccionada:', selectedOption.label);
        // Emitir el valor seleccionado al componente padre
        this.seleccionDropdown.emit(selectedOption.label);
        
        // Aquí puedes almacenar el valor para enviarlo al backend si lo necesitas
        this.dataSharingService.storeContratista(selectedOption); // Almacenar en un servicio o enviarlo directamente
      }
    }
  
    clearSelection(): void {
      if (this.miSelect) {
        this.miSelect.nativeElement.selectedIndex = 0;
      }
    }
  }