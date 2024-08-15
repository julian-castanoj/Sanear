import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface DataRow {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'AIzaSyA-xQNLPI6-mw94n8N0tIrcw4V32XSPBOo'; 
  private spreadsheetId = '1pxeO7euWaGIvbE2wZfcc4R95X4gyuZR7a3s6ya-KVEk'; 
  private range = 'registros!A:G'; 


  private connectionUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getAllData(): Observable<DataRow[]> {
    return this.http.get<any>(this.connectionUrl).pipe(
      map(response => {
        if (response && response.values) {
          const [headers, ...rows] = response.values;
          return rows.map((row: string[]) => {
            return headers.reduce((acc: { [key: string]: string }, header: string, index: number) => {
              acc[header] = row[index] || '';
              return acc;
            }, {});
          });
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching all data:', error);
        return throwError('Error fetching data. Please try again later.'); 
      })
    );
  }
}