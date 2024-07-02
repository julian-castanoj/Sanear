import { Component, Output, EventEmitter } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';

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

  constructor(private dataStorageService: DataStorageService) {}

  onObservationChange(event: Event): void {
    this.observation = (event.target as HTMLTextAreaElement).value;
    this.dataStorageService.addData({ observation: this.observation });
    this.observationChanged.emit(this.observation);
  }
}
