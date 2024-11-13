import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SheetsService {
  private apiKey = 'EyhWh9CpHPZM!5IIf0n-inL2bw$cHtV_c3QTMa$tDWkizlCD%Qgt@IkaNnPrViN6'; 
  private connectionUrl = 'https://sheet.best/api/sheets/450481e6-5e7a-4c94-880f-6e73b268eb01'; 


  /*
    private apiKey = 'EyhWh9CpHPZM!5IIf0n-inL2bw$cHtV_c3QTMa$tDWkizlCD%Qgt@IkaNnPrViN6'; 
  private connectionUrl = 'https://sheet.best/api/sheets/450481e6-5e7a-4c94-880f-6e73b268eb01'; 
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


