import { Component } from '@angular/core';

import { OnInit } from '@angular/core';
import { PlateServiceService } from '../../services/plate-service.service';
import { NgIf,NgFor } from '@angular/common';

@Component({
  selector: 'app-vehicle-list-plate',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './vehicle-list-plate.component.html',
  styleUrl: './vehicle-list-plate.component.css'
})

export class VehicleListPlateComponent implements OnInit {
  selectedLabels: string[] = [];

  constructor(private plateServiceService: PlateServiceService) {} // Inyectar el servicio

  ngOnInit(): void {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.selectedLabels = labels;
    });
  }
}
