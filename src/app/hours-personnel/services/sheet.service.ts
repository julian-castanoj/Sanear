import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataSharingService } from './data-sharing.service';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})

export class SheetsService {


  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
  ) { }

  // Obtener opciones del dropdown (se usa tu backend)
  getDropdownOptions(): Observable<{ value: string, label: string }[]> {
    return this.http.get<{ value: string, label: string }[]>(`${this.apiUrl}/dropdown-options`).pipe(
      catchError(this.handleError)
    );
  }

  getDataForIndex(index: number): Observable<any[]> {
    if (isNaN(index) || index < 0) {
      return throwError('Índice no válido');  // Si el índice es inválido, lanzamos un error
    }
  
    const url = `${this.apiUrl}/getDataForIndex`;
  
    return this.http.post<any[]>(url, { index }).pipe(
      map(response => {
        if (response && Array.isArray(response)) {  
          return response;  // Devolvemos los datos de la fila
        } else {
          return [];  // Si no se encontraron datos, devolvemos un array vacío
        }
      }),
      catchError(error => {
        console.error('Error al obtener los datos para el índice:', index, error);
        return throwError('Error al obtener los datos. Por favor, inténtelo de nuevo más tarde.');
      })
    );
  }
  // Obtener datos de columna usando el índice de la columna
  getDataForColumn(index: number): Observable<any[]> {
    if (isNaN(index) || index < 0) {
      return throwError('Índice no válido');
    }
  
    const url = `${this.apiUrl}/getDataForIndex`; // Endpoint del backend
    return this.http.post<any>(url, { index }).pipe(
      map(response => {
        // Verificar que la respuesta contiene la propiedad 'data' y que esta es un arreglo
        if (response && Array.isArray(response.data)) {
          return response.data; // Devolvemos los datos dentro de 'data'
        } else {
          console.warn('La respuesta no contiene un arreglo válido:', response);
          return [];  // Si no es un arreglo válido, devolvemos un arreglo vacío
        }
      }),
      catchError(error => {
        console.error('Error al obtener los datos para el índice:', error);
        return throwError('Error al obtener los datos. Por favor, inténtelo de nuevo más tarde.');
      })
    );
  }
  
  guardarDatosParaEnviar(): void {
    const datos = {
      dropdownData: this.dataSharingService.getDropdownData(),
      checkTransportData: this.dataSharingService.getCheckTransportData(),
      dataSelectData: this.dataSharingService.getDataSelectData(),
      personnelManagerData: this.dataSharingService.getPersonnelManagerData(),
      observationData: this.dataSharingService.getObservationData()
    };

    this.dataStorageService.addData(datos);
  }

  // Enviar los datos a Google Sheets (ajustado para el nuevo flujo)
  enviarDatosAGoogleSheets(): void {
    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      response => {
        console.log('Datos enviados correctamente a Google Sheets:', response);
      },
      error => {
        console.error('Error al enviar datos a Google Sheets:', error);
      }
    );
  }

  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(error);
  }

  
}


