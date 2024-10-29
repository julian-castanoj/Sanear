import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataSharingService } from './data-sharing.service';
import { PersonnelEntry } from './data-sharing.service';


@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private apiKey = 'S1g2gygjZZSR-$W3RV8i7WEBsOmPZR2OLJrnzR3@J4V_EW_2S!DY9sUhicaahgIm';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/84ad41e8-76ea-4ed2-a3bb-670c67970298/tabs/registros';
  private dataToSave: any = {};
  private apiKey1 = 'S1g2gygjZZSR-$W3RV8i7WEBsOmPZR2OLJrnzR3@J4V_EW_2S!DY9sUhicaahgIm';
  private googleSheetsUrl1 = 'https://sheet.best/api/sheets/84ad41e8-76ea-4ed2-a3bb-670c67970298/tabs/contratista';

  private personnelData: PersonnelEntry[] = [];

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService
  ) {}

  addData(data: any): void {
    this.dataToSave = data;
  }

  getData(): any {
    return this.dataToSave;
  }

  addDropdownSelection(data: any): void | null {
    const dropdownSelection = data.dropdownSelection;
    const selectedOption = this.dataSharingService.getDropdownData();
    if (selectedOption && selectedOption.label) {
      this.dataSharingService.setDropdownData(dropdownSelection, selectedOption.label);
    }
  }

  sendDataToGoogleSheets(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.googleSheetsUrl, this.dataToSave, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  fetchColumnsData(columnIndices: number[]): Observable<string[]> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey1,
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(this.googleSheetsUrl1, { headers }).pipe(
      map((rows: any[]) => {
        console.log('Datos recibidos de la API:', rows); // Log para verificar la estructura
        const selectedColumns: string[] = [];

        // Recorrer las filas y extraer las columnas en los índices especificados
        rows.forEach(row => {
          columnIndices.forEach(index => {
            if (row[index] !== undefined) {
              selectedColumns.push(row[index]);
            }
          });
        });

        return selectedColumns.filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados
      }),
      catchError(this.handleError)
    );
  }

  addFecha(records: PersonnelEntry[]): void {
    this.personnelData = records;
    console.log('Datos almacenados en el servicio de DataStorage:', this.personnelData);
  }

}