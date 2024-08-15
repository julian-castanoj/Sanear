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
  private googleSheetsUrl = 'https://sheet.best/api/sheets/fd621722-48e9-49fb-9e5b-a6b5c641f326/tabs/Rvehiculos';
  private apiKey = 'Kksu!s3DVv$Wvue3#FIYN2n0pUU5wf5t#Ul8Zi$3blzTiq8-loPW8LfgeDUratiq';
  private apiKeyContratistas = 'Kksu!s3DVv$Wvue3#FIYN2n0pUU5wf5t#Ul8Zi$3blzTiq8-loPW8LfgeDUratiq';
  private googleSheetsUrlContratistas = 'https://sheet.best/api/sheets/fd621722-48e9-49fb-9e5b-a6b5c641f326/tabs/registros';

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
      tap(() => this.clearVehicleData()) 
    );
  }

  sendDataToGoogleSheets(): Observable<any> {
    return this.commonDataStorageService.getDataCommon().pipe(
      switchMap(data => {
        const contratista = data.dropdownSelection;
        const transportista = data.transportSelection;
        const fecha = data.selectedDate ? new Date(data.selectedDate).toISOString().split('T')[0] : '';
        const observationData = data.observation;

        // Crear un array para enviar los datos a Google Sheets
        const dataToSend = data.personnelEntries.map((entry: any) => {
          // Buscar la observación correspondiente para cada entrada de personal
          const observation = observationData.find((o: any) => o.nombre === entry.nombre)?.observacion || '';

          return {
            Contratista: contratista,
            Transportista: transportista,
            Fecha: fecha,
            Nombre: entry.nombre.trim(),
            Entrada: entry.entrada ? entry.entrada.trim() : '',
            Salida: entry.salida ? entry.salida.trim() : '',
            Observaciones: observation // Asegúrate de que la observación esté correcta
          };
        });

        // Utilizar fetch para enviar los datos a Google Sheets
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
  }

  private clearContractorData(): void {
    this.commonDataStorageService.clearData();
  }
}