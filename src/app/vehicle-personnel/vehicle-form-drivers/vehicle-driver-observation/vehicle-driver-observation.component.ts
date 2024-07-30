import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-vehicle-driver-observation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-driver-observation.component.html',
  styleUrls: ['./vehicle-driver-observation.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})

export class VehicleDriverObservationComponent {
  @Output() observationChange = new EventEmitter<string>();
  observacion: string = ' ';
  
  onObservationChange(observation: string): void {
    this.observationChange.emit(observation);
  }

}
