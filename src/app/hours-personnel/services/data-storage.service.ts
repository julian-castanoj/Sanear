import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSharingService } from '../services/data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private transportSelection: string = '';
  private apiKey = 'UC@B#qzghPIUmwf0z@9pFyT64e5A%jen7%JfH6Nb20uTyXdy-k1DrI5xB$c@lRGe';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/88262dc1-dedb-4015-a943-2a5f2ca76722/tabs/registros';
  private dataToSave: any = {};
  private dropdownLabel: string = '';

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private commonDataStorageService: CommonDataStorageService,
    private commonDataSharingService: CommonDataSharingService
  ) { }

  addData(data: any): Observable<any>{
    this.dataToSave = { ...this.dataToSave, ...data };
    return this.http.post(this.apiKey, data);
  }

  addDataCommon(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.post(this.googleSheetsUrl, data, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error guardando datos:', error);
        return throwError('Error guardando datos. Por favor, inténtalo de nuevo.'); // Ajusta el mensaje de error según sea necesario
      })
    );
  }

  private validateData(): boolean {
    const { dropdownSelection, selectedDate, personnelEntries, observation } = this.dataToSave;
    return (
      dropdownSelection !== undefined &&
      selectedDate !== undefined &&
      personnelEntries !== undefined &&
      personnelEntries.length > 0 &&
      observation !== undefined && observation.trim() !== ''
    );
  }

  sendDataToGoogleSheets(): Observable<any> {
    if (!this.validateData()) {
      console.error('Datos incompletos o no válidos:', this.dataToSave);
      return throwError('Datos incompletos o no válidos.');
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    const contratista = this.dataSharingService.getDropdownData()?.label;
    // Obtener solo el label del dropdown
    const transportista = this.getCheckTransportData();
    const fecha = this.getDataSelectData() ? new Date(this.getDataSelectData()).toISOString().split('T')[0] : '';
    const observaciones = this.getObservationData();

    const dataToSend = this.getPersonnelManagerData().map(entry => ({
      Contratista: contratista,
      Transportista: transportista,
      Fecha: fecha,
      Nombre: entry.nombre.trim(),
      Entrada: entry.entrada ? entry.entrada.trim() : '',
      Salida: entry.salida ? entry.salida.trim() : '',
      Observaciones: observaciones
    }));

    

    return this.http.post(this.googleSheetsUrl, dataToSend, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; 
  }


  getDropdownData(): string {
    return this.dropdownLabel;
  }
  
  getPersonnelManagerData(): { nombre: string; entrada: string | null; salida: string | null; }[] {
    return this.dataToSave.personnelEntries || [];
  }

  getCheckTransportData(): string {
    return this.dataToSave.transportSelection;
  }

  getDataSelectData(): Date {
    return this.dataToSave.selectedDate;
  }



  getObservationData(): string {
    return this.dataToSave.observation;
  }

  addDropdownSelection(data: any): void | null {
    const dropdownSelection = data.dropdownSelection;
    const selectedOption = this.dataSharingService.getDropdownData();
  
    if (selectedOption && selectedOption.label) {
      this.dataSharingService.setDropdownData(dropdownSelection, selectedOption.label);
    }
  }

  addTransportSelection(data: string): void {
    this.dataToSave.transportSelection = data;
    this.dataSharingService.setCheckTransportData(data);
    
  }

  addSelectedDate(data: Date): void {
    this.dataToSave.selectedDate = data;
    this.dataSharingService.setDataSelectData(data);
    
  }

  addNames(data: { nombre: string, entrada: string | null, salida: string | null }[]): void {
    this.dataToSave.personnelEntries = data;

  }

  addObservation(data: string): void {
    this.dataToSave.observation = data;
    this.dataSharingService.setObservationData(data);
 
  }

  clearData(): void {
    this.dataToSave = {};
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      console.error(
        `Código de error: ${error.status}, ` +
        `Mensaje: ${error.error}`
      );

      
    }
    return throwError('Error al enviar datos a Google Sheets. Por favor, inténtalo de nuevo más tarde.');
  }

  sendDataToCommonDataStorage(data: any): Observable<any> {
    // Set data in CommonDataSharingService
    this.commonDataSharingService.setDropdownData(data.dropdownSelection.index, data.dropdownSelection.label);
    this.commonDataSharingService.setCheckTransportData(data.transportSelection);
    this.commonDataSharingService.setDataSelectData(data.selectedDate);
    this.commonDataSharingService.setPersonnelManagerData(data.personnelEntries);
    this.commonDataSharingService.setObservationData(data.observation);

    console.log('Datos enviados a CommonDataSharingService correctamente.');

    // Assuming addData in CommonDataStorageService returns an observable
    return this.commonDataStorageService.addDataCommon(data).pipe(
      catchError((error: any) => {
        console.error('Error al enviar datos a CommonDataStorageService:', error);
        return throwError('Error al enviar datos. Por favor, inténtalo de nuevo.');
      })
    );
  }
}

/**
/ */