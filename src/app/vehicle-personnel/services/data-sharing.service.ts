import { Injectable } from '@angular/core';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DriverData {
  driver: string;
  observation: string;
  Tipo_carro: string; // Asegúrate de que Tipo_carro esté definido aquí
}

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private dropdownTypes: string[] = [];
  private driverData = new BehaviorSubject<{ [matricula: string]: DriverData }>({});
  private contratista: string = 'No disponible';
  private fecha: string = 'No disponible';
  private selectedLabelsSubject = new BehaviorSubject<string[]>([]);
  selectedLabels$: Observable<string[]> = this.selectedLabelsSubject.asObservable();

  private driverDataSubject = new BehaviorSubject<{ [matricula: string]: DriverData }>({});
  driverData$ = this.driverDataSubject.asObservable();

  constructor(private commonDataStorageService: CommonDataStorageService) {
    this.loadCommonData();
  }

  async loadCommonData(): Promise<void> {
    try {
      const data = await this.commonDataStorageService.getDataCommon().toPromise();
      if (data) {
        this.contratista = data.dropdownSelection || 'No disponible';
        this.fecha = data.selectedDate ? new Date(data.selectedDate).toLocaleDateString() : 'No disponible';
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
    console.log('Labels guardados:', this.dropdownTypes);
  }

  getDropdownTypes(): string[] {
    return this.dropdownTypes;
  }

  getDropdownType(index: number): string | undefined {
    const label = this.dropdownTypes[index];
    console.log(`Label en índice ${index}: ${label}`);
    return label;
  }

  removeDropdownType(index: number): void {
    if (index >= 0 && index < this.dropdownTypes.length) {
      const removed = this.dropdownTypes.splice(index, 1);
      console.log(`Label eliminado en índice ${index}: ${removed}`);
    }
  }

  updateDropdownTypeById(index: number, label: string): void {
    if (index >= 0 && index < this.dropdownTypes.length) {
      this.dropdownTypes[index] = label;
      console.log(`Label actualizado en índice ${index}: ${label}`);
    }
  }

  addDropdownType(label: string): void {
    this.dropdownTypes.push(label);
    console.log(`Label añadido: ${label}`);
  }

  setDriverData(matricula: string, data: DriverData): void {
    const currentData = this.driverData.getValue();
    currentData[matricula] = data;
    this.driverData.next(currentData);
  }

  getDriverData(matricula: string): DriverData | undefined {
    return this.driverData.getValue()[matricula];
  }

  getAllDriverData(): { [matricula: string]: DriverData } {
    return this.driverData.getValue();
  }

  deleteDriverData(key: string): void {
    const currentData = this.driverData.getValue();
    if (currentData[key]) {
      delete currentData[key];
      this.driverData.next(currentData);
    }
  }

  updateDriverData(matricula: string, updatedData: Partial<DriverData>): void {
    const currentData = this.driverData.getValue();
    currentData[matricula] = { ...currentData[matricula], ...updatedData };
    this.driverData.next(currentData);
  }

  updateSelectedLabels(labels: string[]): void {
    this.selectedLabelsSubject.next(labels);
  }
}