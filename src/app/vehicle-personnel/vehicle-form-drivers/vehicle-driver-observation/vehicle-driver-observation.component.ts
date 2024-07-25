import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-driver-observation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-driver-observation.component.html',
  styleUrls: ['./vehicle-driver-observation.component.css'],
  
})

export class VehicleDriverObservationComponent {
  observacion: string = '';

  constructor() { }

  // Método para guardar la observación, si es necesario
  guardarObservacion() {
    console.log('Observación guardada:', this.observacion);
    // Lógica adicional para guardar la observación
  }
}
