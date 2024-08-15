import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataStorageService } from './data-storage.service';
import { DataSharingService } from './data-sharing.service'; 

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  private apiKey = 'Kksu!s3DVv$Wvue3#FIYN2n0pUU5wf5t#Ul8Zi$3blzTiq8-loPW8LfgeDUratiq';
  private connectionUrl = 'https://sheet.best/api/sheets/fd621722-48e9-49fb-9e5b-a6b5c641f326/tabs/vehiculos';

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
  ) { }

  getDataForIndex(index: number): Observable<any[]> {
    const url = `${this.connectionUrl}/${index}`;
    return this.http.get<any[]>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map((response: any[]) => {
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
      map((response: any[]) => {
        if (response && Array.isArray(response)) {
          const columnData = response.map(row => row[index]).filter(value => value !== undefined);
          return columnData; 
        } else {
          return []; 
        }
      }),
      catchError(error => {
        console.error('Error fetching data for column index:', index, error);
        return throwError('Error fetching data. Please try again later.');
      })
    );
  }

 
  getVehicleDropdownOptions(): Observable<{ value: string, label: string}[]> {
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

  getDriverDropdownOptions(): Observable<{ value: string, label: string }[]> {
    const url = `${this.connectionUrl}?_expand=1`;
    return this.http.get<any[]>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map(response => {
        const conductorColumnIndex = this.findConductorColumnIndex(response);
        if (conductorColumnIndex !== -1) {
          const driverNames = response.map(row => row[conductorColumnIndex])
            .filter(name => name !== 'Conductor' && name !== undefined && name !== null) as string[];
          const dropdownOptions = driverNames.map((name, index) => ({ value: String(index), label: name }));
          return dropdownOptions;
        } else {
          console.error('Conductor column data not found in API response.');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching driver dropdown options:', error);
        return throwError('Error fetching driver dropdown options. Please try again later.');
      })
    );
  }
  
  private findConductorColumnIndex(response: any[]): number {
    const firstRow = response[0];
    if (!firstRow) {
      return -1; 
    }
    const columnNames = Object.keys(firstRow);
    const conductorColumnIndex = columnNames.findIndex(columnName => {
      const value = firstRow[columnName];
      return typeof value === 'string' && value.toLowerCase() === 'conductor';
    });
    return conductorColumnIndex;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}