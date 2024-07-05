import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataSharingService {
  private dropdownData: { index: number, label: string } = { index: -1, label: '' };
  private checkTransportData: string = '';
  private dataSelectData: Date = new Date();
  private personnelManagerDataSubject: BehaviorSubject<{ nombre: string; entrada: string; salida: string; }[]> = new BehaviorSubject<{ nombre: string; entrada: string; salida: string; }[]>([]);
  private observationData: string = '';

  setDropdownData(index: number, label: string): void {
    this.dropdownData = { index, label };
  }

  getDropdownData(): { index: number, label: string } {
    return this.dropdownData;
  }

  setCheckTransportData(data: string): void {
    this.checkTransportData = data;
  }

  getCheckTransportData(): string {
    return this.checkTransportData;
  }

  setDataSelectData(data: Date): void {
    this.dataSelectData = data;
  }

  getDataSelectData(): Date {
    return this.dataSelectData;
  }

  setPersonnelManagerData(data: { nombre: string; entrada: string; salida: string; }[]): void {
    this.personnelManagerDataSubject.next(data);
  }

  getPersonnelManagerData(): { nombre: string; entrada: string; salida: string; }[] {
    return this.personnelManagerDataSubject.getValue();
  }

  getPersonnelManagerDataObservable(): Observable<{ nombre: string; entrada: string; salida: string; }[]> {
    return this.personnelManagerDataSubject.asObservable();
  }

  setObservationData(data: string): void {
    this.observationData = data;
  }

  getObservationData(): string {
    return this.observationData;
  }
}