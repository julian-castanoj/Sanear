import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataSharingService } from './data-sharing.service';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  private apiKey = 'AIzaSyA-xQNLPI6-mw94n8N0tIrcw4V32XSPBOo'; 
  private sheetId = '1pxeO7euWaGIvbE2wZfcc4R95X4gyuZR7a3s6ya-KVEk'; 
  private baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values`;

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
  ) { }

  private numberToColumn(num: number): string {
    let column = '';
    let temp;
    while (num > 0) {
      temp = (num - 1) % 26;
      column = String.fromCharCode(temp + 65) + column;
      num = Math.floor((num - temp) / 26);
    }
    return column;
  }

  getDropdownOptions(): Observable<{ value: string, label: string }[]> {
    const range = 'contratista!A2:1000'; // Cabecera de las columnas
    const url = `${this.baseUrl}/${range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const values = response?.values || [];
        if (values.length > 0) {
          const firstRow = values[0];
          return firstRow
            .map((value: string, index: number) => ({ value: index.toString(), label: value }))
            .filter(({ label }: { label: string }) => label !== null && label !== '');
        }
        return [];
      }),
      catchError(this.handleError<{ value: string, label: string }[]>('getDropdownOptions', []))
    );
  }

  getDataForIndex(index: number): Observable<any[]> {
    const range = `contratista!A${index + 1}:ALL${index + 1}`; // Rango para 50,000 filas y 1,000 columnas
    const url = `${this.baseUrl}/${range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const values = response?.values || [];
        return values.length > 0 ? values[0] : []; 
      }),
      catchError(error => {
        console.error('Error fetching data for index:', index, error);
        return throwError('Error fetching data. Please try again later.'); 
      })
    );
  }

  getDataForColumn(column: number): Observable<string[]> {
    const columnLetter = this.numberToColumn(column + 1); // Convertir el índice a letra
    const range = `contratista!${columnLetter}1:${columnLetter}50000`; // Rango para una columna con hasta 50,000 filas
    const url = `${this.baseUrl}/${range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const values = response?.values || [];
        return values.flat().filter((value: string | undefined) => value !== undefined);
      }),
      catchError(error => {
        console.error('Error fetching data for column:', column, error);
        return throwError('Error fetching data. Please try again later.');
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  guardarDatosParaEnviar() {
    const datos = {
      dropdownData: this.dataSharingService.getDropdownData(),
      checkTransportData: this.dataSharingService.getCheckTransportData(),
      dataSelectData: this.dataSharingService.getDataSelectData(),
      personnelManagerData: this.dataSharingService.getPersonnelManagerData(),
      observationData: this.dataSharingService.getObservationData()
    };
    this.dataStorageService.addData(datos);
  }

  enviarDatosAGoogleSheets() {
    const datos = {
      dropdownData: this.dataSharingService.getDropdownData(),
      checkTransportData: this.dataSharingService.getCheckTransportData(),
      dataSelectData: this.dataSharingService.getDataSelectData(),
      personnelManagerData: this.dataSharingService.getPersonnelManagerData(),
      observationData: this.dataSharingService.getObservationData()
    };

    this.dataStorageService.sendDataToGoogleSheets(datos).subscribe(
      response => {
        console.log('Datos enviados correctamente a Google Sheets:', response);
      },
      error => {
        console.error('Error al enviar datos a Google Sheets:', error);
      }
    );
  }
}









