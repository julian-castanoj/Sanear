import { Component, Output, EventEmitter } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-data-observation',
  standalone: true,
  imports: [],
  templateUrl: './data-observation.component.html',
  styleUrl: './data-observation.component.css'
})

export class DataObservationComponent {
  observation: string = '';
  @Output() observationChanged = new EventEmitter<string>();

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  onObservationChange(event: Event): void {
    this.observation = (event.target as HTMLTextAreaElement).value;
    this.dataStorageService.addObservation(this.observation); 
    this.dataSharingService.setObservationData(this.observation);
    this.observationChanged.emit(this.observation); 
  }
}
