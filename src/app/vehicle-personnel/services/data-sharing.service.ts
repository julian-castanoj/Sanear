import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';

export interface VehicleSet {
  idTemporal: number;
  vehiculo: number;
  matricula: string;
  Tipo_vehiculo: string;
}

export interface DriverData {
  driver: string;
  matricula: string;
  observacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private dropdownData: { index: number, label: string } | null = null;
  private driverDataSubject = new BehaviorSubject<{ [matricula: string]: DriverData }>({});
  driverData$ = this.driverDataSubject.asObservable();
  private contratista: string = 'No disponible';
  private fecha: string = 'No disponible';
  private vehicleSetsSubject = new BehaviorSubject<VehicleSet[]>([]);
  vehicleSets$ = this.vehicleSetsSubject.asObservable();

  constructor(private commonDataStorageService: CommonDataStorageService) {
    this.loadCommonData();
  }

  setDropdownData(index: number, label: string): void {
    if (index !== undefined && label) {
      this.dropdownData = { index, label };
    }
  }

  getDropdownData(): { index: number, label: string } | null {
    return this.dropdownData;
  }

  clearData() {
    this.dropdownData = null;
  }

  getDriverData(matricula: string): DriverData | undefined {
    const data = this.driverDataSubject.getValue();
    return data[matricula];
  }

  updateDriverData(matricula: string, driverData: DriverData): void {
    const currentData = this.driverDataSubject.getValue();
    currentData[matricula] = driverData;
    this.driverDataSubject.next(currentData);
  }

  updateVehicleSets(vehicleSets: VehicleSet[]): void {
    this.vehicleSetsSubject.next(vehicleSets);
  }

  async loadCommonData(): Promise<void> {
    try {
      const data = await this.commonDataStorageService.getDataCommon().toPromise();
      if (data) {
        this.contratista = data.dropdownSelection || 'No disponible';
        this.fecha = data.selectedDate ? new Date(data.selectedDate).toLocaleDateString() : 'No disponible';
        console.log(this.contratista);
        console.log(this.fecha);
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

  getVehicleAndDriverData(matricula: string): any {
    const driverData = this.driverDataSubject.getValue()[matricula];
    const vehicleData = this.vehicleSetsSubject.getValue().find(v => v.matricula === matricula);

    return {
      Contratista: this.getContratista(),
      Tipo_carro: vehicleData ? vehicleData.Tipo_vehiculo : 'No disponible',
      Matricula: matricula,
      Conductor: driverData ? driverData.driver : 'No disponible',
      Fecha: this.getFecha(),
      Observaciones: driverData ? driverData.observacion : ''
    };
  }
}