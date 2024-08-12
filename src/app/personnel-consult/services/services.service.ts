import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiKey = 'cRP%DEjLX44I3uppSuF9m0Ffv!2$7ZnTXc6_3pyf$d$P2J$H5kfiqgZqc-nUoWxl';
  private connectionUrl = 'https://sheet.best/api/sheets/13a5cc19-bb20-4404-a76e-239b7406200e/tabs/registros';

  constructor(private http: HttpClient) {}

  // Obtener todos los datos de la hoja
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