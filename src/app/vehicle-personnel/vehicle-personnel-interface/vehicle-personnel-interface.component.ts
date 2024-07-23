import { Component } from '@angular/core';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { Router } from '@angular/router';
import { VehicleManagementComponent } from "../vehicle-management/vehicle-management.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleFormDriversComponent } from '../vehicle-form-drivers/vehicle-form-drivers.component';


@Component({
  selector: 'app-vehicle-personnel-interface',
  standalone: true,
  imports: [VehicleManagementComponent,VehicleFormDriversComponent],
  templateUrl: './vehicle-personnel-interface.component.html',
  styleUrl: './vehicle-personnel-interface.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class VehiclePersonnelInterfaceComponent {

  constructor(private commonDataStorageService: CommonDataStorageService) {}

  saveData(): void {
    this.commonDataStorageService.addData({
      
    });
  }
}