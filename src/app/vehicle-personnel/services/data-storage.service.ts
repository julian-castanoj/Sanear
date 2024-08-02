import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private googleSheetsUrl = 'https://sheet.best/api/sheets/124aa278-4225-4314-a20d-14d24b7fced4/tabs/Rvehiculos';
  private apiKey = 'UKHQeEWwmz0T@Y#MvQt0AFALzre9VIEB8bCmJE4Ptt3F#rVU-rvit6q1ZATbNx4b';
  private apiKeyContratistas = 'cRP%DEjLX44I3uppSuF9m0Ffv!2$7ZnTXc6_3pyf$d$P2J$H5kfiqgZqc-nUoWxl';
  private googleSheetsUrlContratistas = 'https://sheet.best/api/sheets/124aa278-4225-4314-a20d-14d24b7fced4/tabs/registros';

  constructor(
    private http: HttpClient,
    private commonDataStorageService: CommonDataStorageService
  ) { }

  addData(data: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

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
        console.error('Error saving vehicle data:', error);
        return throwError('Error saving vehicle data. Please try again.');
      }),
      tap(() => this.clearVehicleData()), // Limpiar datos después de enviar
      switchMap(() => this.sendDataToGoogleSheets()) // Solo si es necesario
    );
  }

  sendDataToGoogleSheets(): Observable<any> {
    return this.commonDataStorageService.getDataCommon().pipe(
      switchMap(data => {
        const contratista = data.dropdownSelection;
        const transportista = data.transportSelection;
        const fecha = data.selectedDate ? new Date(data.selectedDate).toISOString().split('T')[0] : '';
        const observaciones = data.observation;
  
        const dataToSend = data.personnelEntries.map((entry: any) => ({
          Contratista: contratista,
          Transportista: transportista,
          Fecha: fecha,
          Nombre: entry.nombre.trim(),
          Entrada: entry.entrada ? entry.entrada.trim() : '',
          Salida: entry.salida ? entry.salida.trim() : '',
          Observaciones: observaciones
        }));
  
        console.log('Datos a enviar a Google Sheets:', dataToSend);
  
        return new Observable(observer => {
          fetch(this.googleSheetsUrlContratistas, {
            method: 'POST',
            headers: {
              'X-Api-Key': this.apiKeyContratistas,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(error => {
                throw new Error(`Error al guardar datos: ${error.message}`);
              });
            }
            return response.json();
          })
          .then(data => {
            observer.next(data);
            observer.complete();
            this.clearContractorData();
          })
          .catch(error => {
            console.error('Error al guardar datos:', error);
            observer.error('Error al guardar datos. Intenta nuevamente.');
          });
        });
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error saving data:', error);
    return throwError('Error saving data. Please try again.');
  }

  private clearVehicleData(): void {
    localStorage.removeItem('vehicleData');
    console.log('Datos de vehículos limpiados del almacenamiento local.');
  }

  private clearContractorData(): void {
    this.commonDataStorageService.clearData();
    console.log('Datos de contratistas limpiados y restablecidos.');
  }
}