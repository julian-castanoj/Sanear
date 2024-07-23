import { Component } from '@angular/core';
import { VehicleDriverDropdownComponent } from '../vehicle-form-drivers/vehicle-driver-dropdown/vehicle-driver-dropdown.component';
import { VehicleListPlateComponent } from '../vehicle-form-drivers/vehicle-driver-list-plate/vehicle-list-plate.component';
import { VehicleDriverObservationComponent } from '../vehicle-form-drivers/vehicle-driver-observation/vehicle-driver-observation.component';


@Component({
  selector: 'app-vehicle-form-drivers',
  standalone: true,
  imports: [VehicleListPlateComponent,VehicleDriverDropdownComponent,VehicleDriverObservationComponent],
  templateUrl: './vehicle-form-drivers.component.html',
  styleUrl: './vehicle-form-drivers.component.css'
})
export class VehicleFormDriversComponent {

}
