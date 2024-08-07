import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  standalone: true,
  selector: 'app-data-select',
  templateUrl: './data-select.component.html',
  styleUrls: ['./data-select.component.css'],
})

export class DataSelectComponent implements AfterViewInit {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  constructor(
    private dataStorageService: DataStorageService,
    private dataSharingService: DataSharingService,
  ) {}

  ngAfterViewInit() {
    this.setDateLimits();
  }

  setDateLimits() {
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);
    const minDate = this.formatDate(threeDaysAgo);
    const maxDate = this.formatDate(today);
    if (this.dateInput) {
      this.dateInput.nativeElement.setAttribute('min', minDate);
      this.dateInput.nativeElement.setAttribute('max', maxDate);
    }
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onDateChange(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    const adjustedDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
    this.updateSelectedDate(adjustedDate);
  }

  private updateSelectedDate(date: Date | null) {
    if (date && !isNaN(date.getTime())) {
      this.dataStorageService.addData({ selectedDate: date });
      this.dataSharingService.setDataSelectData(date);     
    }
  }
}