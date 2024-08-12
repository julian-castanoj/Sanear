import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { Subscription } from 'rxjs';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-person-hours-work',
  standalone: true,
  imports: [],
  templateUrl: './person-hours-work.component.html',
  styleUrl: './person-hours-work.component.css'
})

export class PersonHoursWorkComponent implements OnInit, OnDestroy {
  totalHours: number = 0;
  dateRangeSubscription!: Subscription;
  totalHoursSubscription!: Subscription;
  selectedDateRange: { startDate: string | null, endDate: string | null } = { startDate: null, endDate: null };
  data: any[] = [];

  constructor(
    private dataStorageService: DataStorageService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.servicesService.getAllData().subscribe((data: any[]) => {
      this.data = data;
      this.updateTotalHours();
    });

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
    if (this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
      this.dataStorageService.getTotalHours(this.data, this.selectedDateRange).subscribe(totalHours => {
        this.totalHours = totalHours;
      });
    }
  }
}