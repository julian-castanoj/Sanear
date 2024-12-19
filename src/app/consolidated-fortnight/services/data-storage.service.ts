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
  private apiKey = 'Cj8_EQF6$z6%-Fn6TY5W-efNNcC1wpUTouYWVNpJ2w4rQ2GX0xePkS1x_HPXeJAe';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/ca83f3b8-0172-47bb-ae75-6cb8f52a3ce8/tabs/registros';
  private dataToSave: any = {};
  private apiKey1 = 'Cj8_EQF6$z6%-Fn6TY5W-efNNcC1wpUTouYWVNpJ2w4rQ2GX0xePkS1x_HPXeJAe';
  private googleSheetsUrl1 = 'https://sheet.best/api/sheets/ca83f3b8-0172-47bb-ae75-6cb8f52a3ce8/tabs/contratista';
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

  sendDataToGoogleSheets(dataToSend: any[]): Observable<any> {
    return this.http.post(this.googleSheetsUrl, dataToSend);
  }

  registerRecords(records: any[]): Observable<any> {
    return this.http.post(this.apiKey, records);
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
        const selectedColumns: string[] = [];
        rows.forEach(row => {
          columnIndices.forEach(index => {
            if (row[index] !== undefined) {
              selectedColumns.push(row[index]);
            }
          });
        });
        return selectedColumns.filter((value, index, self) => self.indexOf(value) === index); 
      }),
      catchError(this.handleError)
    );
  }

  addFecha(records: PersonnelEntry[]): void {
    this.personnelData = records;
  }
}
