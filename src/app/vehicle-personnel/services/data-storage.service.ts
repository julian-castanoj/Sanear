import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private googleSheetsUrl = 'https://sheet.best/api/sheets/13a5cc19-bb20-4404-a76e-239b7406200e/tabs/Rvehiculos';
  private apiKey = 'UKHQeEWwmz0T@Y#MvQt0AFALzre9VIEB8bCmJE4Ptt3F#rVU-rvit6q1ZATbNx4b';

  constructor(private http: HttpClient) { }

  addData(data: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    // Asegúrate de que los datos a enviar están en el formato correcto
    const dataToSend = data.map(item => ({
      Contratista: item.Contratista,
      Tipo_carro: item.Tipo_carro,
      Matricula: item.Matricula,
      Conductor: item.Conductor,
      Fecha: item.Fecha,
      Observaciones: item.Observaciones
    }));

    return this.http.post(this.googleSheetsUrl, dataToSend, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving data:', error);
        return throwError('Error saving data. Please try again.');
      })
    );
  }
}

