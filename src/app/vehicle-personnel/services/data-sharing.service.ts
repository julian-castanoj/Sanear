import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private dropdownData: { index: number, label: string } | null = null;

  setDropdownData(index: number, label: string): void {
    if (index !== undefined && label) {
      this.dropdownData = { index, label };
    }
  }

  getDropdownData(): { index: number, label: string } | null {
    return this.dropdownData;
  }

  clearData() {
    this.dropdownData = null;
  }
}