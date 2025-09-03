import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'uAM-8gJhDzeWx%splaFtIgMx-1i2XEkBATCzEv5ioade$Fbvm1$cbZUr0Fu4yEC0';
  private connectionUrl = 'https://sheet.best/api/sheets/38bd223f-a35a-4ae4-9136-c9e570aac1e0/tabs/registros';


   /*
  private apiKey = 'uAM-8gJhDzeWx%splaFtIgMx-1i2XEkBATCzEv5ioade$Fbvm1$cbZUr0Fu4yEC0';
  private connectionUrl = '38bd223f-a35a-4ae4-9136-c9e570aac1e0';
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
