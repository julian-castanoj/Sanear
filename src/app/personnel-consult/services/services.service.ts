import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'Gt#3yJll!IjdpBFbfrKX2XlRw0lr2HqVjktCHPumpb0!y3OZi##eweXfTX$jA$#d';
  private connectionUrl = 'https://sheet.best/api/sheets/54d3433a-74ba-4427-9878-ce763e18cdac/tabs/registros';


   /*
 private apiKey = 'Gt#3yJll!IjdpBFbfrKX2XlRw0lr2HqVjktCHPumpb0!y3OZi##eweXfTX$jA$#d'; 
  private connectionUrl = 'https://sheet.best/api/sheets/54d3433a-74ba-4427-9878-ce763e18cdac'; 

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
