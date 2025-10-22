import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SheetsService {
  private apiKey = 'pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I'; 
  private connectionUrl = 'https://sheet.best/api/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7'; 

  
   /*
  https://api.sheetbest.com/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7
  pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I
*/

  constructor(private http: HttpClient) {}

  getDropdownOptions(): Observable<{ value: string, label: string }[]> {
    const url = `${this.connectionUrl}?_expand=1`;
    return this.http.get<any[]>(url, {
      headers: { 'X-Api-Key': this.apiKey }
    }).pipe(
      map(response => {
        const firstRow = response[0];
        return Object.entries(firstRow)
          .filter(([_, value]) => value)
          .map(([key, value]) => ({ value: key, label: value as string }));
      }),
      catchError(error => {
        console.error('Failed to fetch dropdown options:', error);
        return [];
      })
    );
  }
}


