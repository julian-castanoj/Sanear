import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationServiceDropdownPersonnelManagerService {
  

  private columnIndexSource = new BehaviorSubject<number | null>(null);
  columnIndex$ = this.columnIndexSource.asObservable();

  constructor() {}

  setColumnIndex(index: number): void {
    this.columnIndexSource.next(index);
    console.log('Communication:', index);

  }


}
