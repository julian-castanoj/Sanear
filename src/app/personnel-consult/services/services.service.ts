import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'pwniDZ@8ynQOk1I8x9yIofq@h5p9SWSKs5u37T$PxIcBU%Xx%fAeHJs2i6nLD7d3';
  private connectionUrl = 'https://sheet.best/api/sheets/44009dca-2e5d-4c97-a999-4d35db415699/tabs/registros';


    /*
   private apiKey = 'pwniDZ@8ynQOk1I8x9yIofq@h5p9SWSKs5u37T$PxIcBU%Xx%fAeHJs2i6nLD7d3';
  private connectionUrl = 'https://sheet.best/api/sheets/44009dca-2e5d-4c97-a999-4d35db415699/tabs/vehiculos';

*/


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
