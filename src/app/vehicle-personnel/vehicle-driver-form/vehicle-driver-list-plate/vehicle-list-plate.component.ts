import { Component } from '@angular/core';
import { VehiclePlateSelectorComponent } from '../../vehicle-management/vehicle-plate-selector/vehicle-plate-selector.component';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-list-plate',
  standalone: true,
  imports: [VehiclePlateSelectorComponent],
  templateUrl: './vehicle-list-plate.component.html',
  styleUrl: './vehicle-list-plate.component.css'
})

export class VehicleListPlateComponent implements OnInit {


  constructor(private vehiclePlateSelector: VehiclePlateSelectorComponent) { }

  ngOnInit(): void {

    console.log(this.vehiclePlateSelector.labels);


    const labels = this.vehiclePlateSelector.labels;
    console.log(labels.placeholder); 
  }
}
