import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataSharingService } from './data-sharing.service';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})

export class SheetsService {
  private apiKey = 'Kksu!s3DVv$Wvue3#FIYN2n0pUU5wf5t#Ul8Zi$3blzTiq8-loPW8LfgeDUratiq'; 
  private connectionUrl = 'https://sheet.best/api/sheets/fd621722-48e9-49fb-9e5b-a6b5c641f326'; 

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
  ) { }

  getDropdownOptions(): Observable<{ value: string, label: string }[]> {
    const url = `${this.connectionUrl}?_expand=1`;
    return this.http.get<any[]>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map(response => {
        const firstRow = response[0];
        const filteredData = Object.entries(firstRow)
          .filter(([key, value]) => value !== null && value !== '')
          .map(([key, value]) => ({ value: key, label: value as string }));
        return filteredData;
      }),
      catchError(this.handleError<{ value: string, label: string }[]>('getDropdownOptions', []))
    );
  }

  getDataForIndex(index: number): Observable<any[]> {
    const url = `${this.connectionUrl}/${index}`;
    return this.http.get<any>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map(response => {       
        if (response && Array.isArray(response)) {
          return response; 
        } else {
          return []; 
        }
      }),
      catchError(error => {
        console.error('Error fetching data for index:', index, error);
        return throwError('Error fetching data. Please try again later.'); 
      })
    );
  }

  getDataForColumn(index: number): Observable<string[]> {
    const url = `${this.connectionUrl}`;
    return this.http.get<any[]>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map(response => {
        if (response && Array.isArray(response)) {
          const columnData = response.map(row => row[index]).filter(value => value !== undefined);
          return columnData;
        } else {
          return [];
        }
      }),
      catchError(error => {
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
    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      response => {
        console.log('Datos enviados correctamente a Google Sheets:', response);
  
      },
      error => {
        console.error('Error al enviar datos a Google Sheets:', error);
      }
    );
  }
}



