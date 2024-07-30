import { OnInit, ViewChild } from '@angular/core';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';
import { DataSharingService } from '../services/data-sharing.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleManagementComponent } from '../vehicle-management/vehicle-management.component';
import { VehicleFormDriversComponent } from '../vehicle-form-drivers/vehicle-form-drivers.component';
import { Component } from '@angular/core';

interface DriverDataToDisplay {
  Contratista: string;
  Tipo_carro: string;
  Matricula: string;
  Conductor: string;
  Fecha: string;
  Observaciones: string;
}

@Component({
  selector: 'app-vehicle-personnel-interface',
  templateUrl: './vehicle-personnel-interface.component.html',
  styleUrls: ['./vehicle-personnel-interface.component.css']
})

export class VehiclePersonnelInterfaceComponent implements OnInit {

  driverData: { [matricula: string]: { driver: string, observation: string, tipoCarroIndex: number } } = {};
  contratista: string = 'No disponible';
  fecha: string = 'No disponible';
  dropdownTypes: string[] = [];
  vehicleSets: any[] = []; // Asegúrate de que esto está inicializado correctamente

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await this.loadCommonData();
    this.loadDriverData();
    this.loadDropdownTypes();
  }

  async loadCommonData(): Promise<void> {
    try {
      await this.dataSharingService.loadCommonData();
      this.contratista = this.dataSharingService.getContratista();
      this.fecha = this.dataSharingService.getFecha();
    } catch (error) {
      console.error('Error al cargar datos comunes:', error);
    }
  }

  loadDriverData(): void {
    this.driverData = this.dataSharingService.getAllDriverData();
  }

  loadDropdownTypes(): void {
    this.dropdownTypes = this.dataSharingService.getDropdownTypes();
  }

  onDriverDataUpdate(matricula: string, driver: string, observation: string, tipoCarroIndex: number): void {
    // Asegúrate de que tipoCarroIndex sea un número
    const tipoCarroIndexNum = parseInt(tipoCarroIndex.toString(), 10) || 0;
  
    // Actualizar datos en el servicio
    this.driverData[matricula] = { driver, observation, tipoCarroIndex: tipoCarroIndexNum };
  
    // Llamar al método con los 4 argumentos necesarios
    this.dataSharingService.updateDriverData(matricula, driver, observation, tipoCarroIndexNum);
  }

  visualizar(): void {
    const dataToPrint = Object.entries(this.driverData).map(([matricula, data]) => {
      const tipoCarro = this.dropdownTypes[data.tipoCarroIndex] || 'No disponible';
      return {
        Contratista: this.contratista,
        Tipo_carro: tipoCarro,
        Matricula: matricula,
        Conductor: data.driver,
        Fecha: this.fecha,
        Observaciones: data.observation
      };
    });

    console.log('Datos de Driver Data:');
    dataToPrint.forEach(item => {
      console.log('Contratista:', item.Contratista);
      console.log('Tipo de carro:', item.Tipo_carro);
      console.log('Fecha:', item.Fecha);
      console.log('Matrícula:', item.Matricula);
      console.log('Conductor:', item.Conductor);
      console.log('Observaciones:', item.Observaciones);
      console.log('-----------------------------------');
    });
  }
}