import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private dropdownData: any;
  private checkTransportData: any;
  private dataSelectData: any;
  private personnelManagerData: any;
  private observationData: any;

  constructor() { }

  setDropdownData(data: any): void {
    this.dropdownData = data;
  }

  getDropdownData(): any {
    return this.dropdownData;
  }

  setCheckTransportData(data: any): void {
    this.checkTransportData = data;
  }

  getCheckTransportData(): any {
    return this.checkTransportData;
  }

  setDataSelectData(data: any): void {
    this.dataSelectData = data;
  }

  getDataSelectData(): any {
    return this.dataSelectData;
  }

  setPersonnelManagerData(data: any): void {
    this.personnelManagerData = data;
  }

  getPersonnelManagerData(): any {
    return this.personnelManagerData;
  }

  setObservationData(data: any): void {
    this.observationData = data;
  }

  getObservationData(): any {
    return this.observationData;
  }
}