import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-data-select',
  templateUrl: './data-select.component.html',
  styleUrls: ['./data-select.component.css']
})
export class DataSelectComponent {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.setDateLimits();
  }

  setDateLimits() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const minDate = this.formatDate(yesterday);
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
}
