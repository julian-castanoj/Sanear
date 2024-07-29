import { Injectable } from '@angular/core';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';

@Injectable({
  providedIn: 'root'
})

export class DataSharingService {
  private dropdownTypes: string[] = [];
  private driverData: { [matricula: string]: { driver: string, observation: string } } = {};
  private contratista: string = 'No disponible';
  private fecha: string = 'No disponible';

  constructor(private commonDataStorageService: CommonDataStorageService) {
    this.loadCommonData();
  }

  async loadCommonData(): Promise<void> {
    console.log('Cargando datos comunes...');
    try {
      const data = await this.commonDataStorageService.addDataCommon({}).toPromise();
      this.contratista = data?.contratista || 'No disponible';
      this.fecha = data?.fecha || 'No disponible';
      console.log('Datos comunes cargados:', data);
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

  getDropdownType(index: number): string | undefined {
    return this.dropdownTypes[index];
  }

  getTypeDropdown(): string | undefined {
    return this.dropdownTypes.length > 0 ? this.dropdownTypes[0] : undefined;
  }

  updateDriverData(matricula: string, driver: string, observation: string): void {
    this.driverData[matricula] = { driver, observation };
    console.log('Datos del conductor actualizados:', matricula, driver, observation);
  }

  getDriverData(matricula: string): { driver: string, observation: string } | undefined {
    return this.driverData[matricula];
  }

  removeDropdownType(idTemporal: number): void {
    delete this.dropdownTypes[idTemporal];
  }

  updateDropdownTypeById(idTemporal: number, label: string): void {
    this.dropdownTypes[idTemporal] = label;
    console.log('Tipo de carro actualizado:', label);
  }

  addDropdownType(idTemporal: number, label: string): void {
    if (!this.dropdownTypes[idTemporal]) {
      this.dropdownTypes[idTemporal] = label;
      console.log('Nuevo tipo de carro añadido:', label);
    }
  }
}