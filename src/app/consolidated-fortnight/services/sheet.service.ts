import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SheetsService {

  private apiUrl = 'http://localhost:3000/api/dropdown-options';

  /*
    private apiKey = 'EyhWh9CpHPZM!5IIf0n-inL2bw$cHtV_c3QTMa$tDWkizlCD%Qgt@IkaNnPrViN6'; 
  private connectionUrl = 'https://sheet.best/api/sheets/450481e6-5e7a-4c94-880f-6e73b268eb01'; 
  */ 
  constructor(private http: HttpClient) {}

  
  getDropdownOptions(): Observable<{ value: string, label: string }[]> {
    return this.http.get<{ value: string, label: string }[]>('http://localhost:3000/api/dropdown-options').pipe(
      catchError(error => {
        console.error('Failed to fetch dropdown options:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }
}


