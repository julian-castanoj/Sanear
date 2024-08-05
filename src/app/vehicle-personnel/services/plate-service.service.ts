import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlateServiceService {
  private selectedLabelsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedLabels$: Observable<string[]> = this.selectedLabelsSubject.asObservable();

  constructor() {}

  addSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    if (!currentLabels.includes(label)) {
      this.selectedLabelsSubject.next([...currentLabels, label]);
    } else {
      console.warn('La matrícula ya está en la lista:', label);
    }
  }

  removeSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = currentLabels.filter(l => l !== label);
    this.selectedLabelsSubject.next(updatedLabels);
  }

  updateMatricula(index: number, matricula: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = [...currentLabels];
    if (index < updatedLabels.length) {
      updatedLabels[index] = matricula;
    } else {
      updatedLabels.length = index + 1;
      updatedLabels[index] = matricula;
    }
    this.selectedLabelsSubject.next(updatedLabels);
  }

  clearSelectedLabels(): void {
    this.selectedLabelsSubject.next([]);
  }
}