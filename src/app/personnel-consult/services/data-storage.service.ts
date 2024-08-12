import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private totalHoursSubject = new BehaviorSubject<number>(0);
  totalHours$ = this.totalHoursSubject.asObservable();
  
  private dateRangeSubject = new BehaviorSubject<{ startDate: string | null, endDate: string | null }>({ startDate: null, endDate: null });
  dateRange$ = this.dateRangeSubject.asObservable();

  updateTotalHours(hours: number): void {
    this.totalHoursSubject.next(hours);
  }

  updateDateRange(dateRange: { startDate: string | null, endDate: string | null }): void {
    this.dateRangeSubject.next(dateRange);
  }

  getTotalHours(data: any[], dateRange: { startDate: string | null, endDate: string | null }): Observable<number> {
    const totalHours = this.calculateTotalHoursForDateRange(data, dateRange);
    return new BehaviorSubject<number>(totalHours).asObservable();
  }

  private calculateTotalHoursForDateRange(data: any[], dateRange: { startDate: string | null, endDate: string | null }): number {
    const { startDate, endDate } = dateRange;

    const filteredData = data.filter(row => {
      const rowDate = new Date(row.Fecha);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || rowDate >= start) && (!end || rowDate <= end);
    });

    return filteredData.reduce((sum, row) => {
      const start = this.parseTime(row.Entrada);
      const end = this.parseTime(row.Salida);
      return sum + this.calculateHoursDifference(start, end);
    }, 0);
  }

  private parseTime(timeString: string): { hours: number, minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  private calculateHoursDifference(start: { hours: number, minutes: number }, end: { hours: number, minutes: number }): number {
    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;
    return (endMinutes - startMinutes) / 60;
  }
}