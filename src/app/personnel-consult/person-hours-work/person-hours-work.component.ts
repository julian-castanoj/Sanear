import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { Subscription } from 'rxjs';
import { ServicesService } from '../services/services.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DataRangeComponent } from '../data-range/data-range.component';

@Component({
  selector: 'app-person-hours-work',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, DataRangeComponent],
  templateUrl: './person-hours-work.component.html',
  styleUrl: './person-hours-work.component.css'
})

export class PersonHoursWorkComponent implements OnInit, OnDestroy {
  totalHours: string = "0:00";  // Usar formato HH:MM
  dateRangeSubscription!: Subscription;
  totalHoursSubscription!: Subscription;
  selectedDateRange: { startDate: string | null, endDate: string | null } = { startDate: null, endDate: null };
  data: any[] = [];
  isLoading: boolean = false;

  constructor(
    private dataStorageService: DataStorageService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.dateRangeSubscription = this.dataStorageService.dateRange$.subscribe(dateRange => {
      this.selectedDateRange = dateRange;
      this.updateTotalHours();
    });

    this.totalHoursSubscription = this.dataStorageService.totalHours$.subscribe(totalHours => {
      this.totalHours = totalHours;
    });
  }

  ngOnDestroy(): void {
    this.dateRangeSubscription?.unsubscribe();
    this.totalHoursSubscription?.unsubscribe();
  }

  updateTotalHours(): void {
    if (this.selectedDateRange.startDate || this.selectedDateRange.endDate) {
      this.dataStorageService.getTotalHours(this.selectedDateRange).subscribe(totalHours => {
        this.totalHours = totalHours;  // `totalHours` en formato HH:MM
      });
    } else {
      this.totalHours = "0:00";  // Si no hay rango de fechas
    }
  }

  onDateRangeChange(dateRange: { startDate: string | null, endDate: string | null }): void {
    this.dataStorageService.updateDateRange(dateRange);
  }

}