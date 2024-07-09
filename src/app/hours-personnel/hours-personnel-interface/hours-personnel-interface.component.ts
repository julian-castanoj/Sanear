import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../common-components/navbar/navbar.component';
import { DropdownComponent } from '../dropdown/dropdown.component';

import { DataSelectComponent } from '../data-select/data-select.component';
import { PersonnelManagerComponent } from '../personnel-manager/personnel-manager.component';
import { DataObservationComponent } from '../../common-components/data-observation/data-observation.component';
import { ToRegisterComponent } from '../to-register/to-register.component';
import { CheckTransportComponent } from '../check-transport/check-transport.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DropdownComponent, DataSelectComponent, PersonnelManagerComponent,
    DataObservationComponent, ToRegisterComponent, CheckTransportComponent, NgIf ],
  templateUrl: './hours-personnel-interface.component.html',
  styleUrl: './hours-personnel-interface.component.css'
})
export class HoursPersonnelInterfaceComponent {
  constructor(
    private router: Router,
    private dataSharingService: DataSharingService
  ) {}

  
  handleDropdownSelection(event: any) {        
  }

  handleObservationChanged(observation: string): void {
   
  }
}
