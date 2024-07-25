import { Component } from '@angular/core';
import { VehicleDriverDropdownComponent } from '../vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';

import { VehicleDriverObservationComponent } from '../vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';
import { PlateServiceService } from '../services/plate-service.service';

import { NgIf,NgFor } from '@angular/common';

import { OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-form-drivers',
  standalone: true,
  imports: [VehicleDriverDropdownComponent,VehicleDriverObservationComponent,NgIf,NgFor],
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrl: './vehicle-form-drivers.component.css'
})

export class VehicleFormDriversComponent implements OnInit {
  matriculasSeleccionadas: string[] = [];

  constructor(private plateServiceService: PlateServiceService) { }

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculasSeleccionadas = labels;
      console.log('Matrículas seleccionadas en VehicleFormDriversComponent:', this.matriculasSeleccionadas);
    });
  }

  agregarMatricula(matricula: string): void {
    this.plateServiceService.addSelectedLabel(matricula);
  }

  quitarMatricula(matricula: string): void {
    this.plateServiceService.removeSelectedLabel(matricula);
  }

  actualizarMatricula(index: number, matricula: string): void {
    this.plateServiceService.updateMatricula(index, matricula);
  }
}
  /*selectedLabels: string[] = [];
  private labelSubscription: Subscription;

  constructor(private plateServiceService: PlateServiceService) {
    this.labelSubscription = this.plateServiceService.selectedLabel.subscribe(labels => {
      this.selectedLabels = labels;
    });
  }

  ngOnDestroy(): void {
    this.labelSubscription.unsubscribe();
  }*/