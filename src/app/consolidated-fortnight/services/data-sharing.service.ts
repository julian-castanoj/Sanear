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
  private personSource = new BehaviorSubject<string | null>(null);
  
  private dateRecordsSource = new BehaviorSubject<PersonnelEntry[]>([]); 
  private contratistaData: any;
  private inChargeSource = new BehaviorSubject<string | null>(null); // Variable única
  inCharge$ = this.inChargeSource.asObservable();

  dateRecords$ = this.dateRecordsSource.asObservable();
  person$ = this.personSource.asObservable();
  

  updatePerson(person: string | null): void {
    this.personSource.next(person);
  }

  updateInCharge(inCharge: string | null): void {
    console.log('Actualizando contratista en el servicio:', inCharge);  // Verifica que este sea el nombre correcto
    this.inChargeSource.next(inCharge);  // Actualiza el valor de 'contratista' en el servicio
  }
  
  getSelectedInCharge(): string | null {
    return this.inChargeSource.getValue();
  }


  updateDateRecords(records: PersonnelEntry[]): void {
    this.dateRecordsSource.next(records);
  }

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

  updateObservationData(entries: ObservationEntry[]): void {
    this.observationDataSubject.next(entries); 
    console.log(entries); 
  }

  clearData(): void {
    this.observationDataSubject.next([]); 
    this.personSource.next(null);         
    this.inChargeSource.next(null);       
    this.dateRecordsSource.next([]);      
  }

  getSelectedPerson(): string | null {
    return this.personSource.getValue();
  }



  storeContratista(contratista: any) {
    this.contratistaData = contratista;  // Almacenar los datos del contratista
  }

  getContratista() {
    return this.contratistaData;  // Obtener los datos almacenados
  }

}