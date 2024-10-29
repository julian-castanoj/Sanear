import { Component, EventEmitter, Output } from '@angular/core';
import { NgModel, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range-to-record',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './range-to-record.component.html',
  styleUrls: ['./range-to-record.component.css']
})

export class RangeToRecordComponent {
  @Output() dateRangeChange = new EventEmitter<{ date: string }[]>();
  
  startDate: string = '';
  endDate: string = '';

  onDateChange(): void {
    if (this.startDate && this.endDate) {
      const dates = this.generateDateArray(new Date(this.startDate), new Date(this.endDate));
      this.dateRangeChange.emit(dates.map(date => ({ date })));
      console.log('Fechas emitidas:', dates); 
    }
  }

  generateDateArray(start: Date, end: Date): string[] {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }
}