import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SheetsService {
  private apiKey = 'uAM-8gJhDzeWx%splaFtIgMx-1i2XEkBATCzEv5ioade$Fbvm1$cbZUr0Fu4yEC0'; 
  private connectionUrl = 'https://sheet.best/api/sheets/https://sheet.best/api/sheets/38bd223f-a35a-4ae4-9136-c9e570aac1e0'; 

  
/*
  private apiKey = 'uAM-8gJhDzeWx%splaFtIgMx-1i2XEkBATCzEv5ioade$Fbvm1$cbZUr0Fu4yEC0';
  private connectionUrl = '38bd223f-a35a-4ae4-9136-c9e570aac1e0';
*/

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


