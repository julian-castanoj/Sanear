import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlateServiceService {
  private selectedLabelsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  // Observable que emite la lista de etiquetas seleccionadas
  selectedLabel: Observable<string[]> = this.selectedLabelsSubject.asObservable();

  constructor() { }

  // Método para agregar una etiqueta seleccionada
  addSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    if (!currentLabels.includes(label)) {
      this.selectedLabelsSubject.next([...currentLabels, label]);
    }
  }

  // Método para remover una etiqueta seleccionada
  removeSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = currentLabels.filter(l => l !== label);
    this.selectedLabelsSubject.next(updatedLabels);
  }
  
}
