import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SheetsService {
  private apiKey = '6l9tZKICmh!Q@hwVC%sP0lX#$3muC8gZau3yuXAmwzfFT7s%qa0OBBDlw2D0mS%L'; 
  private connectionUrl = 'https://sheet.best/api/sheets/7f4d4a28-b1c3-46be-973e-de7fa6633b74'; 


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


