import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = '6l9tZKICmh!Q@hwVC%sP0lX#$3muC8gZau3yuXAmwzfFT7s%qa0OBBDlw2D0mS%L';
  private connectionUrl = 'https://sheet.best/api/sheets/7f4d4a28-b1c3-46be-973e-de7fa6633b74/tabs/registros';




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