import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SheetsService {
  private apiKey = 'S1g2gygjZZSR-$W3RV8i7WEBsOmPZR2OLJrnzR3@J4V_EW_2S!DY9sUhicaahgIm'; 
  private connectionUrl = 'https://sheet.best/api/sheets/84ad41e8-76ea-4ed2-a3bb-670c67970298'; 

  constructor(private http: HttpClient) {}

  getDropdownOptions(): Observable<{ value: string, label: string }[]> {
    const url = `${this.connectionUrl}?_expand=1`;
    return this.http.get<any[]>(url, {
      headers: { 'X-Api-Key': this.apiKey }
    }).pipe(
      map(response => {
        const firstRow = response[0];
        return Object.entries(firstRow)
          .filter(([_, value]) => value)
          .map(([key, value]) => ({ value: key, label: value as string }));
      }),
      catchError(error => {
        console.error('Failed to fetch dropdown options:', error);
        return [];
      })
    );
  }
}


