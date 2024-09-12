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
  private transportSelection: string = '';
  private apiKey = 'bsXRO%Coc_U2%pyQ$8te%nan1mOrY-Qvn%0HdKF@isl6RuqFUE_aXN2Fkvz0RW%V';
  private googleSheetsUrl =
    'https://sheet.best/api/sheets/d1aaca20-a8a8-4db3-858c-90b688f1f45d/tabs/registros';
  private dataToSave: any = {};
  private dropdownLabel: string = '';

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private commonDataStorageService: CommonDataStorageService,
    private commonDataSharingService: CommonDataSharingService
  ) {}

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

  private getCheckTransportData(): string {
    return this.dataSharingService.getCheckTransportData() || '';
  }

  setTransportSelection(selection: string): void {
    this.transportSelection = selection;
  }

  addNames(entries: any): void {
    this.dataToSave.personnelEntries = entries;
    
  }

  addObservations(observations: ObservationEntry[]): void {
    this.dataToSave.observation = observations;
    console.log('Observations added:', observations);
  }

  sendDataToGoogleSheets(): Observable<any> {
    if (!this.validateData()) {
      console.error('Datos incompletos o no válidos:', this.dataToSave);
      return throwError(() => new Error('Datos incompletos o no válidos.'));
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    });

    const contratista = this.dataSharingService.getDropdownData()?.label || '';
    const transportista = this.getCheckTransportData(); // Esto llama al método que necesitas definir
    const fecha = this.getDataSelectData()
      ? new Date(this.getDataSelectData()!).toISOString().split('T')[0]
      : '';

    const dataToSend = this.getData().names.map((entry: any, index: number) => ({
      Contratista: contratista,
      Transportista: transportista,
      Fecha: fecha,
      Nombre: entry.nombre.trim(),
      Entrada: entry.entrada ? entry.entrada.trim() : '',
      Salida: entry.salida ? entry.salida.trim() : '',
      Observaciones: entry.observacion || '',
    }));

    return this.http.post(this.googleSheetsUrl, dataToSend, { headers }).pipe(
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

  private getDataSelectData(): Date | null {
    return this.dataSharingService.getDataSelectData() || null;
  }

  private getDropdownData(): any {
    return this.dataSharingService.getDropdownData();
  }

  addDataCommon(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    return this.http.post(this.googleSheetsUrl, data, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error guardando datos. Por favor, inténtalo de nuevo.');
      })
    );
  }

  addDropdownSelection(data: any): void | null {
    const dropdownSelection = data.dropdownSelection;
    const selectedOption = this.dataSharingService.getDropdownData();
    if (selectedOption && selectedOption.label) {
      this.dataSharingService.setDropdownData(dropdownSelection, selectedOption.label);
    }
  }

  sendData(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.googleSheetsUrl, data, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && error.error.detail === 'Connection columns are not unique...') {
          console.error('Error: Columnas de conexión no son únicas.');
          return throwError('Error: Columnas de conexión no son únicas.');
        } else if (error.status === 400) {
          console.error('Error 400:', error.error);
          return throwError('Error al enviar los datos: ' + error.error.detail);
        } else {
          console.error('Error del servidor:', error);
          return throwError('Error del servidor: ' + error.message);
        }
      })
    );
  }

  sendDataToCommonDataStorage(data: any): Observable<any> {
    this.commonDataSharingService.setDropdownData(
      data.dropdownSelection.index,
      data.dropdownSelection.label
    );
    this.commonDataSharingService.setCheckTransportData(data.transportSelection);
    this.commonDataSharingService.setDataSelectData(data.selectedDate);
    this.commonDataSharingService.setPersonnelManagerData(data.personnelEntries);
    this.commonDataSharingService.setObservationData(data.observation);
    return this.commonDataStorageService.addDataCommon(data).pipe(
      catchError((error: any) => {
        console.error('Error al enviar datos a CommonDataStorageService:', error);
        return throwError('Error al enviar datos. Por favor, inténtalo de nuevo.');
      })
    );
  }
}