import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private apiKey = 'HjxCCtxZy6EepxQ@ZRmebL2Yjhys8$Npsd2j!k1WqQR73YR1A51Ns-$ZBVzPQ@xD';
  private googleSheetsUrl = 'https://sheet.best/api/sheets/42c29136-e376-44c7-bf19-566e51353fae';
  private dataToSave: any = {};

  constructor(private http: HttpClient) {}

  // Agregar datos para ser guardados
  addData(data: any): void {
    console.log('Datos a guardar:', data);
    this.dataToSave = { ...this.dataToSave, ...data };
  }

  // Validar datos antes de enviar a Google Sheets
  private validateData(): boolean {
    const { dropdownSelection, selectedDate, names, observation } = this.dataToSave;
    return (
      dropdownSelection !== undefined &&
      selectedDate !== undefined &&
      names !== undefined &&
      names.length > 0 &&
      observation !== undefined && observation.trim() !== ''
    );
  }

  // Enviar datos a Google Sheets mediante HTTP POST
  sendDataToGoogleSheets(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    if (!this.validateData()) {
      console.error('Datos inválidos, no se puede enviar a Google Sheets');
      return throwError('Datos inválidos, no se puede enviar a Google Sheets');
    }

    const dataToSend = {
      Contratista: this.dataToSave.dropdownSelection || '',
      Transportista: this.dataToSave.transportSelection || '',
      Fecha: this.dataToSave.selectedDate ? new Date(this.dataToSave.selectedDate).toISOString().split('T')[0] : '',
      Nombre: this.dataToSave.names?.map((entry: any) => entry.nombre.trim()).join(', ') || '',
      Entrada: this.dataToSave.names?.map((entry: any) => entry.entrada.trim()).join(', ') || '',
      Salida: this.dataToSave.names?.map((entry: any) => entry.salida.trim()).join(', ') || '',
      Observaciones: this.dataToSave.observation || ''
    };

    console.log('Datos a enviar:', dataToSend);

    return this.http.post(this.googleSheetsUrl, dataToSend, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
        }
        console.error('Error al enviar datos a Google Sheets:', errorMessage);
        return throwError('Error al enviar datos a Google Sheets. Por favor, inténtalo de nuevo más tarde.');
      })
    );
  }

  // Métodos para agregar datos específicos
  addDropdownSelection(data: number): void {
    this.dataToSave.dropdownSelection = data;
  }

  addTransportSelection(data: string): void {
    this.dataToSave.transportSelection = data;
  }

  addSelectedDate(data: Date): void {
    this.dataToSave.selectedDate = data;
  }

  addNames(data: { nombre: string, entrada: string, salida: string }[]): void {
    this.dataToSave.names = data;
  }

  addObservation(data: string): void {
    this.dataToSave.observation = data;
  }

  // Limpiar datos almacenados
  clearData(): void {
    this.dataToSave = {};
  }

  // Manejo de errores al enviar datos
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error al enviar datos a Google Sheets: ';
    if (error.error instanceof ErrorEvent) {
      errorMessage += error.error.message;
    } else {
      errorMessage += `Status: ${error.status}, Message: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
