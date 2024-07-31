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
  private apiKey = 'UKHQeEWwmz0T@Y#MvQt0AFALzre9VIEB8bCmJE4Ptt3F#rVU-rvit6q1ZATbNx4b';
  private connectionUrl = 'https://sheet.best/api/sheets/13a5cc19-bb20-4404-a76e-239b7406200e/tabs/vehiculos';

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
  ) { }

  // Get data for a specific row index
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

  // Get data for a specific column index
  getDataForColumn(index: number): Observable<string[]> {
    const url = `${this.connectionUrl}`;

    return this.http.get<any[]>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map((response: any[]) => {
        if (response && Array.isArray(response)) {
          const columnKeys = Object.keys(response[0]);
          const columnKey = columnKeys[index];

          if (!columnKey) {
            console.warn('Column index out of range:', index);
            return [];
          }

          const columnData = response.map(row => row[columnKey]).filter(value => value !== undefined);
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

  // Get dropdown options for vehicle types
  getVehicleDropdownOptions(): Observable<{ value: string, label: string }[]> {
    const url = `${this.connectionUrl}?_expand=1`;
    return this.http.get<any[]>(url, {
      headers: {
        'X-Api-Key': this.apiKey
      }
    }).pipe(
      map(response => {
        const firstRow = response[0];

        if (!firstRow) {
          console.warn('No data found in sheet.');
          return [];
        }

        const filteredData = Object.entries(firstRow)
          .filter(([key, value]) => value !== null && value !== '')
          .map(([key, value]) => ({ value: key, label: value as string }));

        return filteredData;
      }),
      catchError(this.handleError<{ value: string, label: string }[]>('getDropdownOptions', []))
    );
  }

  // Get dropdown options for drivers
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

  // Helper function to find the index of the conductor column
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

  // General error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}