import { Component } from '@angular/core';
import { VehicleDriverDropdownComponent } from '../vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';

import { VehicleDriverObservationComponent } from '../vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';
import { PlateServiceService } from '../services/plate-service.service';

import { NgIf,NgFor } from '@angular/common';

import {  OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-vehicle-form-drivers',
  standalone: true,
  imports: [VehicleDriverDropdownComponent,VehicleDriverObservationComponent,NgIf,NgFor],
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrl: './vehicle-form-drivers.component.css'
})
export class VehicleFormDriversComponent {
  selectedLabels: string[] = [];
  private labelSubscription: Subscription;

  constructor(private plateServiceService: PlateServiceService) {
    this.labelSubscription = this.plateServiceService.selectedLabel.subscribe(labels => {
      this.selectedLabels = labels;
    });
  }

  ngOnDestroy(): void {
    this.labelSubscription.unsubscribe();
  }
}
