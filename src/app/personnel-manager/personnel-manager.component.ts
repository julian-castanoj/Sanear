import { Component } from '@angular/core';

@Component({
  selector: 'app-personnel-manager',
  standalone: true,
  imports: [],
  templateUrl: './personnel-manager.component.html',
  styleUrl: './personnel-manager.component.css'
})

export class PersonnelManagerComponent {
  registros = [
    { nombre: 'Juan', entrada: '', salida: '' },
    { nombre: 'María', entrada: '', salida: '' },
    { nombre: 'Pedro', entrada: '', salida: '' }
  ];

  actualizarHoraEntrada(index: number, event: any) {
    this.registros[index].entrada = event.target.value;
  }

  actualizarHoraSalida(index: number, event: any) {
    this.registros[index].salida = event.target.value;
  }

  hora: string = '';

  formatoHora(event: any) {
    let inputVal = event.target.value;
    
    
    if (inputVal && !inputVal.includes(':') && inputVal.length === 2) {
      inputVal = inputVal.padEnd(2, '0') + ':00';
    }
    
    
    this.hora = inputVal;
  }
}
