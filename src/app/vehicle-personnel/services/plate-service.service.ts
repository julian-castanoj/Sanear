import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlateServiceService {

  private selectedLabelsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedLabels$: Observable<string[]> = this.selectedLabelsSubject.asObservable();

  constructor() {}

  addSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    this.selectedLabelsSubject.next([...currentLabels, label]);
  }

  removeSelectedLabel(label: string): void {
    const currentLabels = this.selectedLabelsSubject.getValue();
    const updatedLabels = currentLabels.filter(l => l !== label);
    this.selectedLabelsSubject.next(updatedLabels);
  }

  clearSelectedLabels(): void {
    this.selectedLabelsSubject.next([]);
  }
  
}

