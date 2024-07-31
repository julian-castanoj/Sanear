import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSharingService, DriverData  } from '../services/data-sharing.service';
import { DataStorageService } from '../services/data-storage.service';
import { VehicleManagementComponent } from '../vehicle-management/vehicle-management.component';
import { VehicleFormDriversComponent } from '../vehicle-form-drivers/vehicle-form-drivers.component';


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
  styleUrls: ['./vehicle-personnel-interface.component.css'],
})
export class VehiclePersonnelInterfaceComponent implements OnInit {
  @ViewChild('vehicleManagement') vehicleManagementComponent!: VehicleManagementComponent;
  @ViewChild('vehicleFormDrivers') vehicleFormDriversComponent!: VehicleFormDriversComponent;

  driverData: { [matricula: string]: DriverData } = {};
  contratista: string = 'No disponible';
  fecha: string = 'No disponible';
  dropdownTypes: string[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado');
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
      console.log('Contratista cargado:', this.contratista);
      console.log('Fecha cargada:', this.fecha);
    } catch (error) {
      console.error('Error al cargar datos comunes:', error);
    }
  }

  loadDriverData(): void {
    console.log('Cargando datos de conductores...');
    this.driverData = this.dataSharingService.getAllDriverData();
    console.log('Datos de conductores después de cargar:', this.driverData);
  }

  loadDropdownTypes(): void {
    this.dropdownTypes = this.dataSharingService.getDropdownTypes();
    console.log('Tipos de dropdown cargados:', this.dropdownTypes);

    if (this.dropdownTypes.length === 0) {
      console.warn('No hay tipos de dropdown disponibles.');
    }
  }

  onDriverDataUpdate(matricula: string, driver: string, observation: string, tipoCarroLabel: string): void {
    console.log(`Actualizando datos de ${matricula} con driver: ${driver}, observation: ${observation}, tipoCarroLabel: ${tipoCarroLabel}`);

    if (!this.dropdownTypes.includes(tipoCarroLabel)) {
      console.error(`Tipo de carro ${tipoCarroLabel} no encontrado en dropdownTypes`);
      return;
    }

    this.driverData[matricula] = { driver, observation, Tipo_carro: tipoCarroLabel };
    this.dataSharingService.updateDriverData(matricula, {
      driver,
      observation,
      Tipo_carro: tipoCarroLabel
    });
    console.log(`Datos actualizados para ${matricula}:`, this.driverData[matricula]);
  }

  async sendDataToStorage(): Promise<void> {
    console.log('Contratista antes de enviar:', this.contratista);
    console.log('Fecha antes de enviar:', this.fecha);
    console.log('Contenido de driverData:', this.driverData);

    const dataToSend = Object.entries(this.driverData).map(([matricula, data]) => {
      if (!matricula || !data.driver || !data.Tipo_carro) {
        console.error(`Datos inválidos para matrícula ${matricula}:`, data);
        return null; // Asegúrate de que solo los datos válidos se incluyan en dataToSend
      }

      return {
        Contratista: this.contratista,
        Tipo_carro: data.Tipo_carro, // Usa 'Tipo_carro' en lugar de 'tipoCarroLabel'
        Matricula: matricula,
        Conductor: data.driver,
        Fecha: this.fecha,
        Observaciones: data.observation,
      };
    }).filter(item => item !== null) as DriverDataToDisplay[]; // Filtrar los valores nulos y asegurar el tipo

    console.log('Datos a enviar:', dataToSend);

    if (dataToSend.length === 0) {
      console.warn('No hay datos para enviar.');
      return;
    }

    const errors = this.validateData(dataToSend);
    if (errors.length > 0) {
      console.error('Errores de validación:', errors);
      return;
    }

    try {
      await this.dataStorageService.addData(dataToSend).toPromise();
      console.log('Datos enviados a DataStorageService correctamente.');
    } catch (error) {
      console.error('Error al enviar datos a DataStorageService:', error);
    }
  }

  private validateData(data: DriverDataToDisplay[]): string[] {
    const errors: string[] = [];

    data.forEach((item, index) => {
      if (!item.Contratista || item.Contratista === 'No disponible') {
        errors.push(`Falta Contratista en el item ${index}`);
      }
      if (!item.Tipo_carro || item.Tipo_carro === 'No disponible') {
        errors.push(`Falta Tipo de carro en el item ${index}`);
      }
      if (!item.Matricula) {
        errors.push(`Falta Matrícula en el item ${index}`);
      }
      if (!item.Conductor) {
        errors.push(`Falta Conductor en el item ${index}`);
      }
      if (!item.Fecha || item.Fecha === 'No disponible') {
        errors.push(`Falta Fecha en el item ${index}`);
      }
    });

    return errors;
  }
}