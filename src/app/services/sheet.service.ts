import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  private apiKey = 'HjxCCtxZy6EepxQ@ZRmebL2Yjhys8$Npsd2j!k1WqQR73YR1A51Ns-$ZBVzPQ@xD'; 
  private spreadsheetId = '1pxeO7euWaGIvbE2wZfcc4R95X4gyuZR7a3s6ya-KVEk'; 
  private range = 'Sheet1!A1:B10';

  constructor(private http: HttpClient) { }

  getDropdown(): Observable<{ value: string, label: string }[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const rows = response.values;
        return rows.map((row: any) => ({ value: row[0], label: row[1] }));
      }),
      catchError(this.handleError<{ value: string, label: string }[]>('getDropdown', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

