import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationServiceDropdownPersonnelManagerService } from '../services/communication-service-dropdown-personnel-manager.service';
import { SheetsService } from '../services/sheet.service';
import { NgFor, NgIf } from '@angular/common';



@Component({
  selector: 'app-personnel-manager',
  templateUrl: './personnel-manager.component.html',
  styleUrls: ['./personnel-manager.component.css'],
  standalone: true,
  imports: [NgIf, NgFor]

})

export class PersonnelManagerComponent implements OnDestroy, AfterViewInit {
  selectedIndex: number = -1;
  dataForColumn: string[] = [];
  private columnIndexSubscription: Subscription;
  tableVisible: boolean = true; // Añadimos una bandera para controlar la visibilidad

  constructor(
    private communicationService: CommunicationServiceDropdownPersonnelManagerService,
    private sheetsService: SheetsService
  ) {
    this.columnIndexSubscription = this.communicationService.columnIndex$.subscribe(index => {
      if (index !== null) {
        this.selectedIndex = index;
        this.loadDataForColumn(index);
        this.tableVisible = true; // Mostramos la tabla cuando hay un índice
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadDataForColumn(this.selectedIndex);
  }

  ngOnDestroy(): void {
    this.columnIndexSubscription.unsubscribe();
  }

  private loadDataForColumn(index: number): void {
    this.sheetsService.getDataForColumn(index).subscribe(
      data => {
        this.dataForColumn = data;
        console.log('Data for column index:', index);
      },
      error => {
        console.error('Error fetching data for column index:', index, error);
      }
    );
  }
}