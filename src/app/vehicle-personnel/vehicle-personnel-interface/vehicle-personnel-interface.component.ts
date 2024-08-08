import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from '../services/data-sharing.service';
import { PlateServiceService } from '../services/plate-service.service';
import { DataStorageService } from '../services/data-storage.service';
import { VehicleManagementComponent } from "../vehicle-management/vehicle-management.component";
import { VehicleFormDriversComponent } from '../vehicle-form-drivers/vehicle-form-drivers.component';
import { NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vehicle-personnel-interface',
  standalone: true,
  imports: [VehicleManagementComponent, VehicleFormDriversComponent,NgIf],
  templateUrl: './vehicle-personnel-interface.component.html',
  styleUrls: ['./vehicle-personnel-interface.component.css']
})

export class VehiclePersonnelInterfaceComponent {
  @ViewChild(VehicleManagementComponent) vehicleManagementComponent!: VehicleManagementComponent;
  @ViewChild(VehicleFormDriversComponent) vehicleFormDriversComponent!: VehicleFormDriversComponent;
  matriculas: string[] = [];
  message: string = '';
  contratista: string = '';
  fecha: string = '';
  private dataSubject = new BehaviorSubject<any>(null); 
  data$ = this.dataSubject.asObservable(); 
  
  constructor(
    private dataSharingService: DataSharingService,
    private plateServiceService: PlateServiceService,
    private dataStorageService: DataStorageService,
    private router: Router
  ) {
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculas = labels;
    });
    this.contratista = this.dataSharingService.getContratista();
    this.fecha = this.dataSharingService.getFecha();
  }

  async ngOnInit() {
    await this.dataSharingService.loadCommonData(); 
    this.contratista = this.dataSharingService.getContratista();
    this.fecha = this.dataSharingService.getFecha();
    this.plateServiceService.selectedLabels$.subscribe(labels => {
      this.matriculas = labels;
    });
  }

  saveData(): void {
    if (this.matriculas.length === 0) {
      this.message = 'No hay matrículas seleccionadas.';
      alert(this.message);
      return;
    }
    const vehicleData = this.matriculas.map((matricula: string) => {
      const data = this.dataSharingService.getVehicleAndDriverData(matricula);
      if (data) {
        return {
          Contratista: data.Contratista || 'No disponible',
          Tipo_carro: data.Tipo_carro || 'No disponible',
          Matricula: data.Matricula || 'No disponible',
          Conductor: data.Conductor || 'No disponible',
          Fecha: data.Fecha || 'No disponible',
          Observaciones: data.Observaciones || ''
        };
      } else {
        console.warn(`Datos no encontrados para matrícula: ${matricula}`);
        return {
          Contratista: 'No disponible',
          Tipo_carro: 'No disponible',
          Matricula: matricula,
          Conductor: 'No disponible',
          Fecha: 'No disponible',
          Observaciones: ''
        };
      }
    });
    let missingVehicleType = false;
    let missingMatricula = false;
    let missingConductor = false;
    vehicleData.forEach((data) => {
      if (data.Tipo_carro === 'No disponible') {
        missingVehicleType = true;
      }
      if (data.Contratista === 'No disponible') {
        missingMatricula = true;
      }
      if (data.Conductor === 'No disponible') {
        missingConductor = true;
      }
    });
    let errorMessage = '';
    if (missingVehicleType) {
      errorMessage += 'Falta el tipo de carro. ';
    }
    if (missingMatricula) {
      errorMessage += 'Falta la matrícula. ';
    }
    if (missingConductor) {
      errorMessage += 'Falta el conductor. ';
    }
    if (errorMessage) {
      this.message = `No se pudieron guardar los datos. ${errorMessage}`;
      alert(this.message);
      return;
    }
    this.dataStorageService.addData(vehicleData).subscribe({
      next: (response) => {
        this.message = 'Datos de vehículos guardados correctamente.';
        alert(this.message);
        this.dataStorageService.sendDataToGoogleSheets().subscribe({
          next: (response) => {
            this.message += ' Datos de contratistas guardados correctamente.';
            alert(this.message);
            this.clearFormData(); 
            this.router.navigate(['/']).then(() => window.location.reload());
            

          },
          error: (error) => {
            console.error('Error al guardar los datos de contratistas:', error.message || error);
            this.message = `Error al guardar los datos de contratistas: ${error.message || error}`;
            alert(this.message);
          }
        });
      },
      error: (error) => {
        console.error('Error al guardar los datos de vehículos:', error.message || error);
        this.message = `Error al guardar los datos de vehículos: ${error.message || error}`;
        alert(this.message);
      }
    });
  }

  private clearFormData(): void {
    this.matriculas = [];
    this.contratista = '';
    this.fecha = '';
    this.dataSharingService.clearData();
    if (this.vehicleManagementComponent) {
      this.vehicleManagementComponent.clearData();
    }
    if (this.vehicleFormDriversComponent) {
      this.vehicleFormDriversComponent.clearData();
    }
  }
  
}