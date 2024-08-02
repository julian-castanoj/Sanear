import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlateServiceService {
  // BehaviorSubject para manejar la lista de matrículas
  private selectedLabelsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  // Observable que expone las matrículas seleccionadas
  selectedLabels$: Observable<string[]> = this.selectedLabelsSubject.asObservable();

  constructor() {}

  // Añadir una matrícula seleccionada
  addSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    if (!currentLabels.includes(label)) {
      this.selectedLabelsSubject.next([...currentLabels, label]);
      console.log('Matrícula añadida:', label);
    } else {
      console.warn('La matrícula ya está en la lista:', label);
    }
  }

  // Eliminar una matrícula seleccionada
  removeSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = currentLabels.filter(l => l !== label);
    this.selectedLabelsSubject.next(updatedLabels);
    console.log('Matrícula eliminada:', label);
  }

  // Actualizar una matrícula en una posición específica
  updateMatricula(index: number, matricula: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = [...currentLabels];

    // Comprobar si el índice está dentro del rango
    if (index < updatedLabels.length) {
      updatedLabels[index] = matricula;
    } else {
      // Si el índice está fuera del rango, expandir la lista
      updatedLabels.length = index + 1;
      updatedLabels[index] = matricula;
    }

    this.selectedLabelsSubject.next(updatedLabels);
    console.log('Matrícula actualizada en índice', index, ':', matricula);
  }

  clearSelectedLabels(): void {
    this.selectedLabelsSubject.next([]);
    console.log('Todas las matrículas seleccionadas han sido limpiadas.');
  }
}