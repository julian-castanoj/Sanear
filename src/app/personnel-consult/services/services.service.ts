import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private apiKey = 'pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I';
  private connectionUrl = 'https://sheet.best/api/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7/tabs/registros';


    /*
      
  https://api.sheetbest.com/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7
  pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I
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
