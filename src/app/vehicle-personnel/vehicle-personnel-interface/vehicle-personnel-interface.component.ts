import { Component } from '@angular/core';
import { CommonDataSharingService } from '../../common-components/common-services/common-data-sharing.service';
import { CommonDataStorageService } from '../../common-components/common-services/common-data-storage.service';

@Component({
  selector: 'app-vehicle-personnel-interface',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-personnel-interface.component.html',
  styleUrl: './vehicle-personnel-interface.component.css'
})
export class VehiclePersonnelInterfaceComponent {
  formData: any = {}; // Objeto para almacenar los datos del formulario

  constructor(
    private dataSharingService: CommonDataSharingService,
    private dataStorageService: CommonDataStorageService
  ) {}

  saveFormData() {
    // Guardar los datos de la segunda interfaz en el servicio de datos compartidos
    this.dataSharingService.setVehicleData(this.formData);
  }

  registerAllData() {
    // Obtener los datos de ambas interfaces desde el servicio de datos compartidos
    const formDataFirstInterface = {
      dropdownData: this.dataSharingService.getDropdownData(),
      checkTransportData: this.dataSharingService.getCheckTransportData(),
      dataSelectData: this.dataSharingService.getDataSelectData(),
      personnelManagerData: this.dataSharingService.getPersonnelManagerData(),
      observationData: this.dataSharingService.getObservationData()
    };

    const formDataSecondInterface = this.dataSharingService.getVehicleData();

    // Enviar datos del primer formulario al servicio de almacenamiento
    this.dataStorageService.saveData(formDataFirstInterface).subscribe(
      () => {
        console.log('Datos de la primera interfaz registrados correctamente');
        // No limpiar los datos aquí, se hace después de enviar ambos
      },
      error => {
        console.error('Error al registrar datos de la primera interfaz:', error);
        // Manejar el error según sea necesario
      }
    );

    // Enviar datos del segundo formulario al servicio de almacenamiento
    this.dataStorageService.saveData(formDataSecondInterface).subscribe(
      () => {
        console.log('Datos de la segunda interfaz registrados correctamente');
        this.dataSharingService.clearData(); // Limpiar los datos después de enviar ambos
      },
      error => {
        console.error('Error al registrar datos de la segunda interfaz:', error);
        // Manejar el error según sea necesario
      }
    );
  }
}
