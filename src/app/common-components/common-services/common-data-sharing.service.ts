import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonDataSharingService {
  private dropdownData: { index: number, label: string } | null = null;
  private checkTransportData: string = '';
  private dataToSave: {
    selectedDate?: Date | null;
    dropdownSelection?: any;
    transportSelection?: string;
    personnelEntries?: any[];
    observation?: string;
  } = {};

  // Set data for selectedDate
  setDataSelectData(date: Date | null): void {
    this.dataToSave.selectedDate = date;
  }

  // Get data for selectedDate
  getDataSelectData(): Date | null {
    return this.dataToSave.selectedDate || null;
  }

  // Set and Get Dropdown Data
  setDropdownData(index: number, label: string): void {
    this.dropdownData = { index, label };
    console.log('Dropdown set:', label);
  }

  getDropdownData(): { index: number, label: string } | null {
    return this.dropdownData;
  }

  // Set and Get Check Transport Data
  setCheckTransportData(data: string): void {
    this.checkTransportData = data;
  }

  getCheckTransportData(): string {
    return this.checkTransportData;
  }

  // Set and Get Personnel Manager Data
  private personnelManagerDataSubject: BehaviorSubject<{ nombre: string; entrada: string; salida: string; }[]> = new BehaviorSubject<{ nombre: string; entrada: string; salida: string; }[]>([]);

  setPersonnelManagerData(data: { nombre: string; entrada: string; salida: string; }[]): void {
    this.personnelManagerDataSubject.next(data);
  }

  getPersonnelManagerData(): { nombre: string; entrada: string; salida: string; }[] {
    return this.personnelManagerDataSubject.getValue();
  }

  getPersonnelManagerDataObservable(): Observable<{ nombre: string; entrada: string; salida: string; }[]> {
    return this.personnelManagerDataSubject.asObservable();
  }

  // Set and Get Observation Data
  setObservationData(data: string): void {
    this.dataToSave.observation = data;
  }

  getObservationData(): string {
    return this.dataToSave.observation || '';
  }

  // Clear all data
  clearData(): void {
    this.dropdownData = null;
    this.checkTransportData = '';
    this.dataToSave.selectedDate = null;
    this.dataToSave.observation = '';
    this.personnelManagerDataSubject.next([]);
    this.dataToSave = {}; // Clear all dataToSave properties
  }
}