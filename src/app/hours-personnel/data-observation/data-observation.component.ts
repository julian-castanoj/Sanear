import { Component, Output, EventEmitter } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonnelEntry } from '../services/data-sharing.service';
import { NgClass } from '@angular/common';


export interface ObservationEntry {
  nombre: string;
  observacion: string; // Asegúrate de que esto sea siempre una cadena, no null.
}

@Component({
  selector: 'app-data-observation',
  standalone: true,
  imports: [NgFor, FormsModule, NgClass],
  templateUrl: './data-observation.component.html',
  styleUrls: ['./data-observation.component.css']
})

export class DataObservationComponent implements OnInit {
  @Output() observationChanged = new EventEmitter<ObservationEntry[]>();

  observationEntries: ObservationEntry[] = [];
  names: string[] = [];

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.dataSharingService.getPersonnelManagerDataObservable().subscribe(entries => {
      this.names = entries.map(entry => entry.nombre);
    });
  }

  onObservationChange(event: Event, index: number): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.observationEntries[index].observacion = value ?? '';
    this.dataSharingService.updateObservation(index, value ?? '');
    this.observationChanged.emit(this.observationEntries);
  }

  onNameChange(event: Event, index: number): void {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.observationEntries[index].nombre = selectedName;
    this.updateObservationForSelectedName(index);
    this.observationChanged.emit(this.observationEntries);
  }

  private updateObservationForSelectedName(index: number): void {
    const selectedName = this.observationEntries[index].nombre;
    if (selectedName) {
      const data = this.dataSharingService.getPersonnelManagerData();
      const entry = data.find(entry => entry.nombre === selectedName);
      if (entry) {
        this.observationEntries[index].observacion = entry.observacion ?? '';
        entry.observacion = this.observationEntries[index].observacion;
        this.dataSharingService.setPersonnelManagerData(data);
      }
    }
  }

  addObservationEntry(): void {
    if (this.hasAvailableNames()) {
      this.observationEntries.push({ nombre: '', observacion: '' });
    }
  }

  removeObservationEntry(index: number): void {
    if (this.observationEntries[index]) {
      this.observationEntries.splice(index, 1);
      this.updateAvailableNames();
    }
  }

  getAvailableNames(index: number): string[] {
    const selectedNames = this.observationEntries
      .map((entry, idx) => idx !== index ? entry.nombre : null)
      .filter(name => name !== null);
    return this.names.filter(name => !selectedNames.includes(name));
  }

  hasAvailableNames(): boolean {
    return this.names.length > this.observationEntries.length;
  }

  private updateAvailableNames(): void {
    this.names = this.dataSharingService.getPersonnelManagerData()
      .map(entry => entry.nombre);
  }
}