import { Component } from '@angular/core';
import { VehiclePlateSelectorComponent } from '../vehicle-management/vehicle-plate-selector/vehicle-plate-selector.component';
import { OnInit } from '@angular/core';
import { VehicleDriverDropdownComponent } from './vehicle-driver-dropdown/vehicle-driver-dropdown.component';
import { VehicleListPlateComponent } from './vehicle-driver-list-plate/vehicle-list-plate.component';
import { VehicleDriverObservationComponent } from './vehicle-driver-observation/vehicle-driver-observation.component';

@Component({
  selector: 'app-vehicle-driver-form',
  standalone: true,
  imports: [ VehiclePlateSelectorComponent, VehicleDriverDropdownComponent, VehicleListPlateComponent, VehicleDriverObservationComponent ],
  templateUrl: './vehicle-management-form.component.html',
  styleUrl: './vehicle-management-form.component.css'
})
export class VehicleDriverFormComponent implements OnInit {


  constructor(private vehiclePlateSelector: VehiclePlateSelectorComponent) { }

  ngOnInit(): void {

    console.log(this.vehiclePlateSelector.labels);
    const labels = this.vehiclePlateSelector.labels;
    console.log(labels.placeholder);
  }
}
