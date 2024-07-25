import { Component } from '@angular/core';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { Router } from '@angular/router';
import { VehicleManagementComponent } from "../vehicle-management/vehicle-management.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleFormDriversComponent } from '../vehicle-form-drivers/vehicle-form-drivers.component';
import { ViewChild } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service'
import { PlateServiceService } from '../services/plate-service.service';


@Component({
  selector: 'app-vehicle-personnel-interface',
  standalone: true,
  imports: [VehicleManagementComponent, VehicleFormDriversComponent],
  templateUrl: './vehicle-personnel-interface.component.html',
  styleUrl: './vehicle-personnel-interface.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class VehiclePersonnelInterfaceComponent {

  

  @ViewChild(VehicleManagementComponent) vehicleManagementComponent!: VehicleManagementComponent;
  @ViewChild(VehicleFormDriversComponent) vehicleFormDriversComponent!: VehicleFormDriversComponent;

  constructor(
    private commonDataStorageService: CommonDataStorageService,
    private commonDataSharingService: CommonDataSharingService,
    private plateServiceService: PlateServiceService
  ) {}

  saveData(): void {
    // Obtener datos del CommonDataSharingService
    const contratista = this.commonDataSharingService.getDropdownData()?.label;
    console.log(contratista);
    const fecha = this.commonDataSharingService.getDataSelectData();
    console.log(fecha);
    /* Obtener datos del VehicleManagementComponent
    const tipoCarro = this.vehicleManagementComponent.getSelectedVehicleType();
    console.log(tipoCarro);
    const matricula = this.plateServiceService.getSelectedLabels();
    console.log(matricula);

    // Obtener datos del VehicleFormDriversComponent
    const conductor = this.vehicleFormDriversComponent.getConductor();
    console.log(conductor);
    const observacion = this.vehicleFormDriversComponent.getObservacion();
    console.log(observacion); */

    // Validar que todos los datos necesarios estén presentes
    if (contratista && fecha //&& tipoCarro && matricula && conductor && observacion
      ) {
      // Llamar al servicio para almacenar los datos
      this.commonDataStorageService.addData({
        Contratista: contratista,
        //Tipo_carro: tipoCarro,
        //Matricula: matricula,
        //Conductor: conductor,
        Fecha: fecha,
        //Observacion: observacion
      }).subscribe(
        (response) => {
          console.log('Datos guardados correctamente:', response);
        },
        (error) => {
          console.error('Error al guardar los datos:', error);
        }
      );
    } else {
      console.error('No se pudieron guardar los datos. Faltan datos requeridos.');
    }
  }
}