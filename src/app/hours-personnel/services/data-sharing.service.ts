import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ObservationEntry {
  nombre: string;
  observacion: string;
}

export interface PersonnelEntry {
  nombre: string;
  entrada?: string | null;
  salida?: string | null;
  observacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private personnelManagerDataSubject = new BehaviorSubject<PersonnelEntry[]>([]);
  private observationDataSubject = new BehaviorSubject<ObservationEntry[]>([]);

  personnelManagerData$ = this.personnelManagerDataSubject.asObservable();
  observationData$ = this.observationDataSubject.asObservable();

  private dropdownDataSubject = new BehaviorSubject<{ index: number; label: string } | null>(null);
  private checkTransportData = new BehaviorSubject<string>('');
  private dataSelectData = new BehaviorSubject<Date | null>(null);

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

  setCheckTransportData(data: string): void {
    this.checkTransportData.next(data);
  }

  getCheckTransportData(): string {
    return this.checkTransportData.getValue();
  }

  setDataSelectData(data: Date | null): void {
    this.dataSelectData.next(data);
  }

  getDataSelectData(): Date | null {
    return this.dataSelectData.getValue();
  }

  setPersonnelManagerData(data: PersonnelEntry[]): void {
    this.personnelManagerDataSubject.next(data);
  }

  setObservationData(data: ObservationEntry[]): void {
    this.observationDataSubject.next(data);
  }

  getPersonnelManagerData(): PersonnelEntry[] {
    return this.personnelManagerDataSubject.getValue();
  }

  getPersonnelManagerDataObservable(): Observable<PersonnelEntry[]> {
    return this.personnelManagerData$;
  }

  getObservationData(): ObservationEntry[] {
    return this.observationDataSubject.getValue();
  }

  updateObservation(index: number, observation: string): void {
    const data = this.personnelManagerDataSubject.getValue();
    if (index >= 0 && index < data.length) {
      data[index].observacion = observation;
      this.personnelManagerDataSubject.next(data);
    }
  }

  clearData(): void {
    this.dropdownDataSubject.next(null);
    this.checkTransportData.next('');
    this.dataSelectData.next(null);
    this.personnelManagerDataSubject.next([]);
    this.observationDataSubject.next([]);
  }
}
