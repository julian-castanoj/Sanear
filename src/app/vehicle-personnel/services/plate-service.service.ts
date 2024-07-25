import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlateServiceService {
  private selectedLabelsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  selectedLabels$: Observable<string[]> = this.selectedLabelsSubject.asObservable();

  constructor() { }

  addSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    if (!currentLabels.includes(label)) {
      this.selectedLabelsSubject.next([...currentLabels, label]);
    }
  }

  removeSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = currentLabels.filter(l => l !== label);
    this.selectedLabelsSubject.next(updatedLabels);
  }

  updateMatricula(index: number, matricula: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    // Asegúrate de que la lista es lo suficientemente larga
    const updatedLabels = [...currentLabels];
    if (index < updatedLabels.length) {
      updatedLabels[index] = matricula;
    } else {
      // Añadir elementos vacíos si el índice está fuera del rango
      updatedLabels.length = index + 1; // Asegurarse de que la longitud es suficiente
      updatedLabels[index] = matricula;
    //console.log('Matrícula actualizada en índice', index, ':', matricula);
    //console.log('Lista actual de matrículas:', [...currentLabels]);
    }
    this.selectedLabelsSubject.next(updatedLabels);
  }
}