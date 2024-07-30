import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataStorageService {
  private data: any = {};

  addDataCommon(data: any): Observable<any> {
    this.data = data;
    console.log('Datos recibidos en CommonDataStorageService:', data);
    return of(this.data);
  }

  getDataCommon(): Observable<any> {
    return of(this.data);
  }
}