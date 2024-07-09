import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataStorageService {
  constructor() {}

  saveData(data: any): Observable<any> {
    // Aquí iría la lógica para guardar los datos, por ejemplo, enviarlos a un servidor
    console.log('Datos guardados:', data);
    return of({ success: true });
  }

  sendDataToGoogleSheets(): Observable<any> {
    // Aquí iría la lógica para enviar los datos a Google Sheets
    return of({ success: true });
  }
}