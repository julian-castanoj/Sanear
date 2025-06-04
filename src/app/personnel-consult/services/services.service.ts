import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'd_jJzqlHccvZRf9D39ox5MMyFaX2Yrmu5R1s!H7W@39e1I$d4zyWMJsZ-a9GpDG5';
  private connectionUrl = 'https://sheet.best/api/sheets/7f47a472-214a-40f8-b7ad-84a8ed198612/tabs/registros';





  constructor(private http: HttpClient) {}

  getAllData(): Observable<any[]> {
    return this.http.get<any[]>(this.connectionUrl, {
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
        console.error('Error fetching all data:', error);
        return throwError('Error fetching data. Please try again later.'); 
      })
    );
  }
}
