import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../common-components/auth/auth.service';
import { LoginComponent } from '../common-components/login/login.component';
import { FormsModule } from '@angular/forms';
import { DropdownPersonComponent } from "../consolidated-fortnight/dropdpwn-person/dropdpwn-person.component";
import { DropdpwnInchargeComponent } from './dropdpwn-incharge/dropdpwn-incharge.component';
import { RangeToRecordComponent } from "./range-to-record/range-to-record.component";
import { DaysToRegisterComponent } from "./days-to-register/days-to-register.component";
import { DateObservationComponent } from '../consolidated-fortnight/date-observation/date-observation.component';
import { ObservationEntry } from "../consolidated-fortnight/services/data-sharing.service"
import { DataSharingService } from '../consolidated-fortnight/services/data-sharing.service';



export interface DayRecord {
  fecha: string;
  entrada?: string | null;
  salida?: string | null;
  observacion?: string;
}

@Component({
  selector: 'app-consolidated-fortnight',
  imports: [NgIf, NgFor, LoginComponent, FormsModule, DropdownPersonComponent, DropdpwnInchargeComponent, RangeToRecordComponent, DaysToRegisterComponent, DateObservationComponent],
  templateUrl: './consolidated-fortnight.component.html',
  styleUrls: ['./consolidated-fortnight.component.css'],
  standalone: true
})

export class ConsolidatedFortnightComponent implements OnInit {
  observationEntries: ObservationEntry[] = []; 
  isAuthenticated = false;
  dateRecords: DayRecord[] = [];
  selectedDates: string[] = []; 

  constructor(private authService: AuthService, private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

  updateTable(dates: { date: string }[]) {
    this.dateRecords = dates.map(dateObj => ({
      fecha: dateObj.date,
      entrada: '',
      salida: ''
    }));
    this.selectedDates = dates.map(dateObj => dateObj.date);
    console.log('Fechas seleccionadas:', this.selectedDates);
  }

  // Método opcional si deseas manejar el evento `observationChanged`
  onObservationChanged(updatedEntries: ObservationEntry[]) {
    this.observationEntries = updatedEntries;
    console.log('Observaciones actualizadas:', this.observationEntries);
  }

  addObservationEntry(selectedDate: string) {
    if (!this.observationEntries.some(entry => entry.fecha === selectedDate)) {
      this.observationEntries.push({ fecha: selectedDate, observacion: '' }); 
      this.dataSharingService.updateObservationData(this.observationEntries);
      console.log('Nueva observación agregada:', this.observationEntries);
    } else {
      console.log('Esta fecha ya ha sido seleccionada');
    }
  }
}

