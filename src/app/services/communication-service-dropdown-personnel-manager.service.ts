import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommunicationServiceDropdownPersonnelManagerService {
  private columnIndexSource = new Subject<number>();

  columnIndex$ = this.columnIndexSource.asObservable();

  setColumnIndex(index: number) {
    this.columnIndexSource.next(index);
    console.log('CommunicationServiceDropdownPersonnelManagerService:   ');
    console.log(index);
  }
}
