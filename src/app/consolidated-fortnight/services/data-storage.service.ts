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


  private apiKey = 'pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7/tabs/registros';


  private dataToSave: any = {};


  private apiKey1 = 'pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I';
  private googleSheetsUrl1 = 'https://sheet.best/api/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7/tabs/contratista';


  private personnelData: PersonnelEntry[] = [];


   /*
  https://api.sheetbest.com/sheets/7ee958b1-5451-422a-b15d-9711dcebadb7
  pjHHTR56W_4jECCVh@muXe%rPpcMZjEBnOvxXhmtNbrP4#J1u1-4$aw-#4QlWO@I
*/


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
