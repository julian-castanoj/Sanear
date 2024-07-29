import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSharingService } from '../services/data-sharing.service';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private googleSheetsUrl = 'https://sheet.best/api/sheets/88262dc1-dedb-4015-a943-2a5f2ca76722/tabs/Rvehiculos';

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService
  ) {}

  addData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer UC@B#qzghPIUmwf0z@9pFyT64e5A%jen7%JfH6Nb20uTyXdy-k1DrI5xB$c@lRGe`
    });

    return this.http.post(this.googleSheetsUrl, data, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving data:', error);
        return throwError('Error saving data. Please try again.');
      })
    );
  }

  sendDataToGoogleSheets(): Observable<any> {
    return throwError('sendDataToGoogleSheets method not implemented');
  }

  clearData(): void {
    console.warn('clearData method not implemented');
  }
}