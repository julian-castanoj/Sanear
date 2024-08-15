import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-range',
  standalone: true,
  templateUrl: './data-range.component.html',
  styleUrls: ['./data-range.component.css'],
  imports: [FormsModule]
})

export class DataRangeComponent {
  @Output() dateRangeChange = new EventEmitter<{ startDate: string | null, endDate: string | null }>();
  
  startDate: string | null = null;
  endDate: string | null = null;

  onDateChange(): void {
    this.dateRangeChange.emit({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }
}