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
  // Subjects to manage state
  private dropdownDataSubject = new BehaviorSubject<{ index: number; label: string } | null>(null);
  private observationDataSubject = new BehaviorSubject<ObservationEntry[]>([]);
  private personnelDataSubject = new BehaviorSubject<PersonnelEntry[]>([]);
  private personSource = new BehaviorSubject<string | null>(null);
  private inChargeSource = new BehaviorSubject<string | null>(null);
  private dateRecordsSource = new BehaviorSubject<PersonnelEntry[]>([]); 

  // Observables for external subscription
  dateRecords$ = this.dateRecordsSource.asObservable();
  person$ = this.personSource.asObservable();
  inCharge$ = this.inChargeSource.asObservable();

  // Update methods for each piece of data
  updatePerson(person: string | null): void {
    this.personSource.next(person);
  }

  updateInCharge(inCharge: string | null): void {
    this.inChargeSource.next(inCharge);
  }

  updateDateRecords(records: PersonnelEntry[]): void {
    this.dateRecordsSource.next(records);
  }

  // Dropdown data management
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

  // Observation data management
  getObservationDataObservable(): Observable<ObservationEntry[]> {
    return this.observationDataSubject.asObservable();
  }

  updateObservationData(entries: ObservationEntry[]): void {
    this.observationDataSubject.next(entries); 
    console.log(entries);  // For debugging
  }

  // Clear all data
  clearData(): void {
    this.observationDataSubject.next([]); 
    this.personSource.next(null);         
    this.inChargeSource.next(null);       
    this.dateRecordsSource.next([]);      
  }

  // Getters for current selected person and in charge
  getSelectedPerson(): string | null {
    return this.personSource.getValue();
  }

  getSelectedInCharge(): string | null {
    return this.inChargeSource.getValue();
  }
}