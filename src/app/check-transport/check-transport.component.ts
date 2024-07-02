import { Component } from '@angular/core';

@Component({
  selector: 'app-check-transport',
  standalone: true,
  imports: [],
  templateUrl: './check-transport.component.html',
  styleUrl: './check-transport.component.css'
})
export class CheckTransportComponent {
  transportistaMoto: string = '';

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.transportistaMoto = selectElement.value;
    console.log('Seleccionado:', this.transportistaMoto);
  }
}
