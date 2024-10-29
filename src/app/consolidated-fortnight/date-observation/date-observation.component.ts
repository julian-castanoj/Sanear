import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DataSharingService } from '../services/data-sharing.service';
import { ObservationEntry } from '../services/data-sharing.service';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-observation',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './date-observation.component.html',
  styleUrls: ['./date-observation.component.css']
})

export class DateObservationComponent implements OnInit {
  @Input() observationEntries: ObservationEntry[] = [];
  @Input() availableFechas: string[] = [];
  @Output() observationChanged = new EventEmitter<ObservationEntry[]>();

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.dataSharingService.getObservationDataObservable().subscribe((entries: ObservationEntry[]) => {
      this.observationEntries = entries;
      console.log('Observation entries actualizadas:', this.observationEntries);
    });
  }

  onObservationChange(event: Event, index: number): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.observationEntries[index].observacion = value;
    this.observationChanged.emit(this.observationEntries);
  }

  onFechaChange(event: Event, index: number): void {
    const selectedFecha = (event.target as HTMLSelectElement).value;
    this.observationEntries[index].fecha = selectedFecha;
    this.observationChanged.emit(this.observationEntries);
  }

  getAvailableFechas(index: number): string[] {
    const selectedFechas = this.observationEntries
      .filter((entry, idx) => idx !== index && entry.fecha)  // Excluir la fecha de la entrada actual
      .map(entry => entry.fecha);
    return this.availableFechas.filter(fecha => !selectedFechas.includes(fecha));
  }

  addObservationEntry(): void {
    if (this.getAvailableFechas(-1).length > 0) {
      this.observationEntries.push({ fecha: '', observacion: '' });
      this.observationChanged.emit(this.observationEntries);
    } else {
      console.log('No hay fechas disponibles para agregar una nueva observación.');
    }
  }

  removeObservationEntry(index: number): void {
    this.observationEntries.splice(index, 1);
    this.observationChanged.emit(this.observationEntries);
  }
}