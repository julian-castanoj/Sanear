import { Component } from '@angular/core';
import { VehicleTypeDropdownComponent } from "../vehicle-management/vehicle-type-dropdown/vehicle-type-dropdown.component";
import { VehiclePlateSelectorComponent } from "./vehicle-plate-selector/vehicle-plate-selector.component";
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    VehicleTypeDropdownComponent,
    FormsModule,
    VehiclePlateSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-management.component.html',
  styleUrl: './vehicle-management.component.css'
})
export class VehicleManagementComponent {
  vehicleSets: { vehiculo: number, matricula: string }[] = [];

  constructor() {
    this.addVehicleSet();
  }

  onVehicleTypeSelected(columnIndex: number, index: number): void {
    this.vehicleSets[index].vehiculo = columnIndex;
  }

  addVehicleSet(): void {
    this.vehicleSets.push({ vehiculo: 0, matricula: '' });
  }

  removeVehicleSet(index: number): void {
    if (this.vehicleSets.length > 1) {
      this.vehicleSets.splice(index, 1);
    }
  }
}