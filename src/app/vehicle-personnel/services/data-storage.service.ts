import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private googleSheetsUrl = 'https://sheet.best/api/sheets/88262dc1-dedb-4015-a943-2a5f2ca76722/tabs/Rvehiculos';
  private apiKey = 'UC@B#qzghPIUmwf0z@9pFyT64e5A%jen7%JfH6Nb20uTyXdy-k1DrI5xB$c@lRGe';

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

