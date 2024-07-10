import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataStorageService } from './data-storage.service';
import { DataSharingService } from './data-sharing.service'; // Asegúrate de importar DataSharingService

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  private apiKey = 'UC@B#qzghPIUmwf0z@9pFyT64e5A%jen7%JfH6Nb20uTyXdy-k1DrI5xB$c@lRGe';
  private connectionUrl = 'https://sheet.best/api/sheets/88262dc1-dedb-4015-a943-2a5f2ca76722/tabs/Rvehiculos'; // URL específica de la hoja de cálculo

  constructor(
    private http: HttpClient,
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService,
  ) { }

  getVehicleDropdownOptions(): Observable<{ value: string, label: string }[]> {
    // Aquí deberías implementar la lógica para obtener las opciones específicas de vehículos
    // Por ahora, devolveré un array vacío como ejemplo
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  guardarDatosParaEnviar() {
    const datos = {
      dropdownData: this.dataSharingService.getDropdownData(),
      
    };

    this.dataStorageService.addData(datos);
  }

  enviarDatosAGoogleSheets() {
    // Preparar datos para enviar a Google Sheets
    const datos = {
      dropdownSelection: this.dataSharingService.getDropdownData()?.index, // Ajusta según tu estructura de datos
      
    };

    

    
    this.dataStorageService.sendDataToGoogleSheets().subscribe(
      (response: any) => {
        console.log('Datos enviados exitosamente a Google Sheets:', response);
        this.dataStorageService.clearData();
      },
      (error: any) => {
        console.error('Error al enviar datos a Google Sheets:', error);
      }
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}