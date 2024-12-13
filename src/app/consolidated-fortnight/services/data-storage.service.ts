import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataSharingService } from './data-sharing.service';
import { PersonnelEntry } from './data-sharing.service';
import { ObservationEntry } from './data-sharing.service';


@Injectable({
  providedIn: 'root'
})

export class DataStorageService {

  private dataToSave: any = {};


  private apiUrl = 'http://localhost:3000/api';
  private personnelData: PersonnelEntry[] = [];

  private apiUrl1 = 'http://localhost:3000/api/register-records'



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

  sendDataToGoogleSheets(dataToSend: any[]): Observable<any> {
    return this.http.post(this.apiUrl1, dataToSend); // Aquí enviamos los datos al backend
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
  getDropdownOptions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dropdown-options`);
  }
  getFilteredColumns(columnIndices: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/filtered-columns`, { columnIndices });
  }

  addFecha(records: PersonnelEntry[]): void {
    this.personnelData = records;
  }
}