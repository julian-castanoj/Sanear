import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataStorageService {
  addData(data: any): Observable<any> {
    console.log('Datos recibidos en CommonDataStorageService:', data);
    return of(data);
  }
}