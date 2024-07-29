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

  driverData: { [matricula: string]: { driver: string, observation: string } } = {};
  contratista: string = 'No disponible';
  fecha: string = 'No disponible';
  dropdownTypes: string[] = [];

  @ViewChild(VehicleFormDriversComponent) vehicleFormDriversComponent!: VehicleFormDriversComponent;

  constructor(
    private commonDataStorageService: CommonDataStorageService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await this.loadCommonData();
    this.loadDriverData();
    this.loadDropdownTypes();
  }

  async loadCommonData(): Promise<void> {
    console.log('Cargando datos comunes...');
    try {
      const data = await this.commonDataStorageService.addDataCommon({}).toPromise();
      this.contratista = this.dataSharingService.getContratista();
      this.fecha = this.dataSharingService.getFecha();
      console.log('Contratista y Fecha cargados:', this.contratista, this.fecha);
    } catch (error) {
      console.error('Error al cargar datos comunes:', error);
    }
  }

  loadDriverData(): void {
    console.log('Cargando datos de drivers...');
    const matriculas = Object.keys(this.dataSharingService['driverData']);

    matriculas.forEach(matricula => {
      const data = this.dataSharingService.getDriverData(matricula);
      if (data) {
        this.driverData[matricula] = data;
      }
    });

    console.log('Datos cargados en driverData:', this.driverData);
  }

  loadDropdownTypes(): void {
    console.log('Cargando tipos de dropdown...');
    const tipoDropdown = this.dataSharingService.getTypeDropdown();
    if (tipoDropdown) {
      this.dropdownTypes.push(tipoDropdown);
    }
    console.log('Tipo de dropdown:', this.dropdownTypes);
  }

  visualizar(): void {
    const dataToPrint: DriverDataToDisplay[] = Object.entries(this.driverData).map(([matricula, data]) => {
      const tipoCarro = this.dropdownTypes.length > 0 ? this.dropdownTypes[0] : 'No disponible';

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
    console.log('Visualizar contratista', this.contratista);
    console.log('Visualizar fecha', this.fecha);

    dataToPrint.forEach(item => {
      console.log('Matrícula:', item.Matricula);
      console.log('Conductor:', item.Conductor);
      console.log('Observaciones:', item.Observaciones);
      console.log('-----------------------------------');
    });
  }
}