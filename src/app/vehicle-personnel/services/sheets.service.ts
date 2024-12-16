import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';  // Importamos 'of' aquí

@Injectable({
  providedIn: 'root',
})
export class SheetsService {
  private backendUrl = 'http://localhost:3000/api/data'; // URL de tu backend Node.js

  constructor(private http: HttpClient) {}

  getDataForIndex(index: number): Observable<any[]> {
    const url = `${this.backendUrl}/index/${index}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError('getDataForIndex', []))
    );
  }

  getDataForColumn(index: number): Observable<string[]> {
    const url = `${this.backendUrl}/column/${index}`;
    return this.http.get<string[]>(url).pipe(
      catchError(this.handleError('getDataForColumn', []))
    );
  }

  getVehicleDropdownOptions(): Observable<{ value: string; label: string }[]> {
    const url = `${this.backendUrl}/vehicle-dropdown`;
    return this.http.get<{ value: string; label: string }[]>(url).pipe(
      catchError(this.handleError('getVehicleDropdownOptions', []))
    );
  }

  getDriverDropdownOptions(): Observable<{ value: string; label: string }[]> {
    const url = `${this.backendUrl}/driver-dropdown`;
    return this.http.get<{ value: string; label: string }[]>(url).pipe(
      catchError(this.handleError('getDriverDropdownOptions', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Usamos 'of' directamente aquí
      return of(result as T);  // Aquí cambiamos 'Observable.of' por 'of'
    };
  }
}