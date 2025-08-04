import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'Sb$Ur08t_AZv8g%5sViTx4Gt8jrYyW8HpYJ$L5@t1Y!KxPWGGRzkpWTcSlhCuikH';
  private connectionUrl = 'https://sheet.best/api/sheets/4e7adda9-ae54-4fff-825d-00a3bfe790aa/tabs/registros';


   //     https://api.sheetbest.com/sheets/4e7adda9-ae54-4fff-825d-00a3bfe790aa
//    'Sb$Ur08t_AZv8g%5sViTx4Gt8jrYyW8HpYJ$L5@t1Y!KxPWGGRzkpWTcSlhCuikH';


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
