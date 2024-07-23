import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataSharingService {
  private dropdownData: { index: number, label: string } | null = null;
  private checkTransportData: string = '';
  private dataSelectData: Date | null = null;
  private personnelManagerDataSubject: BehaviorSubject<{ nombre: string; entrada: string; salida: string; }[]> = new BehaviorSubject<{ nombre: string; entrada: string; salida: string; }[]>([]);
  private observationData: string = '';

  setDropdownData(index: number, label: string): void {
    if (index !== undefined && label) {
        this.dropdownData = { index, label };
    }
}

  
  getDropdownData(): { index: number, label: string } | null {
    console.log("Getting dropdown data:", this.dropdownData); // Verificar que los datos sean correctos
    return this.dropdownData;
  }

  setCheckTransportData(data: string): void {
    this.checkTransportData = data;
    console.log(data);
  }

  getCheckTransportData(): string {
    return this.checkTransportData;
  }

  setDataSelectData(data: Date ): void {
    this.dataSelectData = data;
    console.log(data);
  }

  getDataSelectData(): Date | null {
    return this.dataSelectData;
  }

  setPersonnelManagerData(data: { nombre: string; entrada: string; salida: string; }[]): void {
    this.personnelManagerDataSubject.next(data);
    console.log(data);
  }

  getPersonnelManagerData(): { nombre: string; entrada: string; salida: string; }[] {
    return this.personnelManagerDataSubject.getValue();
  }

  getPersonnelManagerDataObservable(): Observable<{ nombre: string; entrada: string; salida: string; }[]> {
    return this.personnelManagerDataSubject.asObservable();
  }

  setObservationData(data: string): void {
    this.observationData = data;
    console.log(data);
  }

  getObservationData(): string {
    return this.observationData;
  }

  clearData() {
    this.dropdownData = null;
    this.checkTransportData = '';
    this.dataSelectData = null;
    this.observationData = '';
  }
}