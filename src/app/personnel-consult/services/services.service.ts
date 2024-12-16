import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private connectionUrl = 'http://localhost:3000/api/data';  // URL de tu API backend

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any[]> {
    return this.http.get<any[]>(this.connectionUrl).pipe(
      map((response: any[]) => {
        if (response && Array.isArray(response)) {
          return response; 
        } else {
          return [];  // Si no se recibe un array válido, se devuelve un array vacío
        }
      }),
      catchError(error => {
        console.error('Error fetching all data:', error);  // Log más detalles
        return throwError('Error fetching data. Please try again later.');
      })
    );
  }
}