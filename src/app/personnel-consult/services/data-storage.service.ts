import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private dateRangeSubject = new BehaviorSubject<{ startDate: string | null, endDate: string | null }>({ startDate: null, endDate: null });
  dateRange$ = this.dateRangeSubject.asObservable();

  private totalHoursSubject = new BehaviorSubject<string>("0:00");  // Usar formato HH:MM
  totalHours$ = this.totalHoursSubject.asObservable();

  updateTotalHours(hours: string): void {
    this.totalHoursSubject.next(hours);
  }

  updateDateRange(dateRange: { startDate: string | null, endDate: string | null }): void {
    this.dateRangeSubject.next(dateRange);
  }

  getTotalHours(dateRange: { startDate: string | null, endDate: string | null }): Observable<string> {
    // Aquí deberías calcular las horas totales basado en el rango de fechas
    const totalHours = this.calculateTotalHoursForDateRange(dateRange);
    return new BehaviorSubject<string>(totalHours).asObservable();
  }

  private calculateTotalHoursForDateRange(dateRange: { startDate: string | null, endDate: string | null }): string {
    // Lógica para calcular las horas basadas en el rango de fechas
    const filteredData = this.getFilteredData(dateRange);

    let totalMinutes = filteredData.reduce((sum, item) => {
      const start = this.parseTime(item.Entrada);
      const end = this.parseTime(item.Salida);

      if (!start || !end) {
        return sum;
      }

      return sum + this.calculateHoursDifference(start, end);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  private getFilteredData(dateRange: { startDate: string | null, endDate: string | null }): any[] {
    // Implementar lógica para filtrar los datos basados en el rango de fechas
    return [];
  }

  private parseTime(timeString: string | null): { hours: number, minutes: number } | null {
    if (!timeString) {
      return null;
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    return { hours, minutes };
  }

  private calculateHoursDifference(start: { hours: number, minutes: number }, end: { hours: number, minutes: number }): number {
    let hoursDiff = end.hours - start.hours;
    let minutesDiff = end.minutes - start.minutes;

    if (minutesDiff < 0) {
      minutesDiff += 60;
      hoursDiff -= 1;
    }

    return hoursDiff * 60 + minutesDiff;  // Devuelve minutos totales
  }
}