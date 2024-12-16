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
  @Output() seleccionEncargado = new EventEmitter<string>();
  selectedEncargado: string | null = null;
  @ViewChild('miSelect') miSelect!: ElementRef;
  contratista: string | null = null;

  constructor(private sheetsService: SheetsService, private dataSharingService: DataSharingService) { }

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

  onSelectionChange(event: any): void {
    const selectedValue = event.target.value;  // Captura el valor de la opción seleccionada
    console.log('Contratista seleccionado:', selectedValue);  // Verifica si el valor es correcto
    this.contratista = selectedValue;  // Asigna el valor del contratista seleccionado
    this.dataSharingService.updateInCharge(this.contratista);  // Actualiza el servicio con el nuevo valor
  }


  clearSelection(): void {
    if (this.miSelect) {
      this.miSelect.nativeElement.selectedIndex = 0;
    }
  }
  
}