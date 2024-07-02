import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private apiKey = 'HjxCCtxZy6EepxQ@ZRmebL2Yjhys8$Npsd2j!k1WqQR73YR1A51Ns-$ZBVzPQ@xD';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/42c29136-e376-44c7-bf19-566e51353fae';

  private dataToSave: any = {};  // Cambiado a un solo objeto

  constructor(private http: HttpClient) { }

  addData(data: any): void {
    console.log('Datos a guardar:', data);
    // Combina los datos nuevos con los existentes
    this.dataToSave = { ...this.dataToSave, ...data };
  }

  sendDataToGoogleSheets(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    const dataToSend = [this.dataToSave]; // Envía los datos como un array con un solo objeto

    // Envía los datos almacenados a Google Sheets y maneja errores
    return this.http.post(this.googleSheetsUrl, dataToSend, { headers }).pipe(
      catchError(error => {
        console.error('Error sending data to Google Sheets:', error);
        return throwError('Error sending data to Google Sheets. Please try again later.');
      })
    );
  }

  clearData(): void {
    this.dataToSave = {};
  }
}