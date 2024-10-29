import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ObservationEntry {
  fecha: string; 
  observacion: string;
}

export interface PersonnelEntry {
  fecha: string; 
  entrada?: string | null;
  salida?: string | null;
  observacion?: string;
}

@Injectable({
  providedIn: 'root',
})

export class DataSharingService {
  private dropdownDataSubject = new BehaviorSubject<{ index: number; label: string } | null>(null);
  private observationDataSubject = new BehaviorSubject<ObservationEntry[]>([]);
  private personnelDataSubject = new BehaviorSubject<PersonnelEntry[]>([]);
  private observationEntries: ObservationEntry[] = [];

  setDropdownData(index: number, label: string): void {
    if (index !== undefined && label) {
      this.dropdownDataSubject.next({ index, label });
    }
  }

  getDropdownData(): { index: number; label: string } | null {
    return this.dropdownDataSubject.getValue();
  }

  getDropdownDataObservable(): Observable<{ index: number; label: string } | null> {
    return this.dropdownDataSubject.asObservable();
  }

  clearDropdownData(): void {
    this.dropdownDataSubject.next(null);
  }

  getObservationDataObservable(): Observable<ObservationEntry[]> {
    return this.observationDataSubject.asObservable();
  }

  getPersonnelManagerDataObservable(): Observable<PersonnelEntry[]> {
    return this.personnelDataSubject.asObservable();
  }

  updatePersonnelData(data: PersonnelEntry[]): void {
    this.personnelDataSubject.next(data);
  }


  updateObservationData(entries: ObservationEntry[]): void {
    this.observationEntries = entries;
    this.observationDataSubject.next(this.observationEntries); // Notifica a los suscriptores
  }

}
