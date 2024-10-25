import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

// Importaciones de los componentes actualizados
import { NavbarComponent } from './common-components/navbar/navbar.component';
import { DropdownComponent } from '../app/hours-personnel/dropdown/dropdown.component';
import { DataSelectComponent } from '../app/hours-personnel/data-select/data-select.component';
import { PersonnelManagerComponent } from '../app/hours-personnel/personnel-manager/personnel-manager.component';
import { DataObservationComponent } from './hours-personnel/data-observation/data-observation.component';
import { ToRegisterComponent } from '../app/hours-personnel/to-register/to-register.component';
import { CheckTransportComponent } from '../app/hours-personnel/check-transport/check-transport.component';
import { NgIf } from '@angular/common';
import { DataSharingService } from '../app/hours-personnel/services/data-sharing.service';

import { LoginComponent } from './common-components/login/login.component';
import { ConsolidatedFortnightComponent } from './consolidated-fortnight/consolidated-fortnight.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    DropdownComponent,
    DataSelectComponent,
    PersonnelManagerComponent,
    DataObservationComponent,
    ToRegisterComponent,
    CheckTransportComponent,
    LoginComponent,
    ConsolidatedFortnightComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(
    private router: Router,
    private dataSharingService: DataSharingService
  ) {}

  handleDropdownSelection(event: any) {
    // Lógica para manejar la selección del dropdown
  }

  handleObservationChanged(observation: string): void {
    // Lógica para manejar el cambio en la observación
  }
}