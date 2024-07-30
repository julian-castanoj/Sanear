import { Injectable } from '@angular/core';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataSharingService {
  private dropdownTypes: string[] = [];
  driverData: { [matricula: string]: { driver: string, observation: string, tipoCarroIndex: number } } = {};
  private contratista: string = 'No disponible';
  private fecha: string = 'No disponible';
  private driverDataSubject = new BehaviorSubject<{ [matricula: string]: { driver: string, observation: string, tipoCarroIndex: number } }>({});

  driverData$ = this.driverDataSubject.asObservable();

  constructor(private commonDataStorageService: CommonDataStorageService) {
    this.loadCommonData();
  }

  async loadCommonData(): Promise<void> {
    console.log('Cargando datos comunes...');
    try {
      const data = await this.commonDataStorageService.getDataCommon().toPromise();
      if (data) {
        this.contratista = data.dropdownSelection || 'No disponible';
        this.fecha = data.selectedDate ? new Date(data.selectedDate).toLocaleDateString() : 'No disponible';
        console.log('Datos comunes cargados:', data);
      } else {
        console.warn('No hay datos comunes disponibles.');
      }
    } catch (error) {
      console.error('Error al cargar datos comunes:', error);
    }
  }

  getContratista(): string {
    return this.contratista;
  }

  getFecha(): string {
    return this.fecha;
  }

  saveLabels(labels: string[]): void {
    this.dropdownTypes = labels;
  }

  getDropdownTypes(): string[] {
    return this.dropdownTypes;
  }

  getDropdownType(index: number): string | undefined {
    return this.dropdownTypes[index];
  }

  removeDropdownType(index: number): void {
    if (index >= 0 && index < this.dropdownTypes.length) {
      this.dropdownTypes.splice(index, 1);
    }
  }

  updateDropdownTypeById(index: number, label: string): void {
    if (index >= 0 && index < this.dropdownTypes.length) {
      this.dropdownTypes[index] = label;
    }
  }

  addDropdownType(label: string): void {
    this.dropdownTypes.push(label);
  }

 

  getDriverData(matricula: string): { driver: string, observation: string, tipoCarroIndex: number } | undefined {
    return this.driverData[matricula];
  }

  updateDriverData(matricula: string, driver: string, observation: string, tipoCarroIndex: number) {
    const currentData = this.driverDataSubject.getValue();
    currentData[matricula] = { driver, observation, tipoCarroIndex };
    this.driverDataSubject.next(currentData);
  }

  removeDriverData(matricula: string) {
    const currentData = this.driverDataSubject.getValue();
    delete currentData[matricula];
    this.driverDataSubject.next(currentData);
  }

  getAllDriverData(): { [matricula: string]: { driver: string, observation: string, tipoCarroIndex: number } } {
    return this.driverData;
  }
}