import { Component, Output, EventEmitter } from '@angular/core';

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

  onObservationChange(event: Event): void {
    this.observation = (event.target as HTMLTextAreaElement).value;
    this.observationChanged.emit(this.observation);
  }

}
