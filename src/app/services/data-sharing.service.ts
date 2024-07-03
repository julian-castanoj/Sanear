import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataSharingService {
  private dropdownData: number = 0;
  private checkTransportData: string = '';
  private dataSelectData: Date = new Date();
  private personnelManagerData: { nombre: string; entrada: string; salida: string; }[] = [];
  private observationData: string = '';

  constructor() {}

  setDropdownData(data: number): void {
    this.dropdownData = data;
  }

  getDropdownData(): number {
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
    this.personnelManagerData = data;
  }

  getPersonnelManagerData(): { nombre: string; entrada: string; salida: string; }[] {
    return this.personnelManagerData;
  }

  setObservationData(data: string): void {
    this.observationData = data;
  }

  getObservationData(): string {
    return this.observationData;
  }
}