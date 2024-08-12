import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { Subscription } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services/services.service';


@Component({
  selector: 'app-person-result-view',
  standalone: true,
  imports: [NgFor,NgIf,CommonModule],
  templateUrl: './person-result-view.component.html',
  styleUrls: ['./person-result-view.component.css']
})

export class PersonResultViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @Input() selectedName: string = '';
  @Input() selectedDateRange: { startDate: string | null, endDate: string | null } = { startDate: null, endDate: null };

  allData: any[] = [];
  filteredData: any[] = [];
  displayedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  private subscription!: Subscription;

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.subscription = this.servicesService.getAllData().subscribe((data: any[]) => {
      // Add unique id to each data item if not present
      this.allData = data.map((item, index) => ({ ...item, id: item.id || index }));
      this.updateFilteredData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['selectedName'] || changes['selectedDateRange']) {
      this.updateFilteredData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateFilteredData(): void {
    if (!this.allData || !Array.isArray(this.allData)) {
      console.warn('All data is not available or not an array.');
      return;
    }

    // Apply filters
    this.filteredData = this.allData.filter(item => {
      const isInDateRange = this.isInDateRange(item.Fecha);
      const isNameMatch = this.selectedName ? item.Nombre.toLowerCase().includes(this.selectedName.toLowerCase()) : true;
      return isInDateRange && isNameMatch;
    });

    // Update pagination
    this.totalItems = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ensure currentPage is within bounds
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    this.updateDisplayedData();
  }

  isInDateRange(date: string): boolean {
    const itemDate = new Date(date);
    const start = this.selectedDateRange.startDate ? new Date(this.selectedDateRange.startDate) : null;
    const end = this.selectedDateRange.endDate ? new Date(this.selectedDateRange.endDate) : null;
    return (!start || itemDate >= start) && (!end || itemDate <= end);
  }

  removeRow(index: number): void {
    // Get the id of the item to be removed
    const itemId = this.displayedData[index]?.id;

    if (itemId !== undefined) {
      // Remove the item from allData
      this.allData = this.allData.filter(item => item.id !== itemId);
      // Update filtered data
      this.updateFilteredData();
    }
  }

  updateDisplayedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  parseTime(timeString: string): { hours: number, minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  calculateHoursDifference(start: { hours: number, minutes: number }, end: { hours: number, minutes: number }): number {
    let hoursDiff = end.hours - start.hours;
    let minutesDiff = end.minutes - start.minutes;

    if (minutesDiff < 0) {
      minutesDiff += 60;
      hoursDiff -= 1;
    }

    return hoursDiff + (minutesDiff / 60);
  }
}