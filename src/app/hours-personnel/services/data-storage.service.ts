import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSharingService } from '../services/data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';
import { ObservationEntry } from '../data-observation/data-observation.component'; 

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private apiEndpoint = 'http://localhost:3000/api/register-records'; // Nuevo endpoint para guardar en el backend
  private dataToSave: any = {};
  private transportSelection: string = '';
  private dropdownLabel: string = '';

  constructor(private http: HttpClient, private dataSharingService: DataSharingService) {}

  clearStoredData(): void {
    this.dataToSave = {};
    this.transportSelection = '';
    this.dropdownLabel = '';
  }

  addData(data: any): void {
    this.dataToSave = data;
  }

  getData(): any {
    return this.dataToSave;
  }

  addTransportSelection(transportSelection: string): void {
    this.transportSelection = transportSelection;
    this.dataToSave.transportSelection = transportSelection;
  }

  addNames(entries: any): void {
    this.dataToSave.personnelEntries = entries;
  }

  addObservations(observations: ObservationEntry[]): void {
    this.dataToSave.observation = observations;
    console.log('Observations added:', observations);
  }

  // Método modificado pero con el mismo nombre
  sendDataToGoogleSheets(): Observable<any> {
    if (!this.validateData()) {
      console.error('Datos incompletos o no válidos:', this.dataToSave);
      return throwError(() => new Error('Datos incompletos o no válidos.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const contratista = this.dataSharingService.getDropdownData()?.label || '';
    const transportista = this.getCheckTransportData();
    const fecha = this.getDataSelectData()
      ? new Date(this.getDataSelectData()!).toISOString().split('T')[0]
      : '';

    // Preparar los datos para enviar
    const dataToSend = this.getData().names.map((entry: any) => ({
      Contratista: contratista,
      Transportista: transportista,
      Fecha: fecha,
      Nombre: entry.nombre.trim(),
      Entrada: entry.entrada ? entry.entrada.trim() : '',
      Salida: entry.salida ? entry.salida.trim() : '',
      Observaciones: entry.observacion || '',
    }));

    // Enviar datos al endpoint del backend
    return this.http.post(this.apiEndpoint, dataToSend, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private validateData(): boolean {
    const { dropdownSelection, selectedDate, names, observation } = this.dataToSave;
    return (
      dropdownSelection !== undefined &&
      selectedDate !== undefined &&
      names !== undefined &&
      names.length > 0 &&
      observation !== undefined &&
      observation.length > 0
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getCheckTransportData(): string {
    return this.dataSharingService.getCheckTransportData() || '';
  }

  private getDataSelectData(): Date | null {
    return this.dataSharingService.getDataSelectData() || null;
  }
}