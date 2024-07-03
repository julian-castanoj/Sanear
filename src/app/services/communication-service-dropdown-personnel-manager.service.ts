import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommunicationServiceDropdownPersonnelManagerService {
  private columnIndexSubject = new BehaviorSubject<number>(0);
  columnIndex$ = this.columnIndexSubject.asObservable();

  constructor() { }

  setColumnIndex(index: number): void {
    if (index >= 0) {
      this.columnIndexSubject.next(index);
    } else {
      console.error('Índice de columna no válido:', index);
    }
  }

  getColumnIndex(): Observable<number> {
    return this.columnIndex$;
  }
}