import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSharingService } from '../services/data-sharing.service';

@Injectable({
  providedIn: 'root',
  
})


export class DataStorageService {
  private transportSelection: string = '';
  private apiKey = 'HjxCCtxZy6EepxQ@ZRmebL2Yjhys8$Npsd2j!k1WqQR73YR1A51Ns-$ZBVzPQ@xD';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/42c29136-e376-44c7-bf19-566e51353fae/tabs/registros';
  private dataToSave: any = {};
  private dropdownLabel: string = '';

  constructor(private http: HttpClient, private dataSharingService: DataSharingService) {}

  addData(data: any): void {
    
    this.dataToSave = { ...this.dataToSave, ...data };
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
}