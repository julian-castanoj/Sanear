import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../../common-components/navbar/navbar.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DataSelectComponent } from '../data-select/data-select.component';
import { PersonnelManagerComponent } from '../personnel-manager/personnel-manager.component';
import { DataObservationComponent } from '../data-observation/data-observation.component';
import { ToRegisterComponent } from '../to-register/to-register.component';
import { CheckTransportComponent } from '../check-transport/check-transport.component';
import { DataSharingService } from '../services/data-sharing.service';
import { ToSecondComponent } from "../to-second/to-second.component";
import { ObservationEntry } from '../data-observation/data-observation.component';

@Component({
  selector: 'app-hours-personnel-interface',
  standalone: true,
  imports: [
    RouterOutlet, NavbarComponent, DropdownComponent, DataSelectComponent, PersonnelManagerComponent,
    DataObservationComponent, ToRegisterComponent, CheckTransportComponent, NgIf,
    ToSecondComponent
  ],
  templateUrl: './hours-personnel-interface.component.html',
  styleUrls: ['./hours-personnel-interface.component.css']
})

export class HoursPersonnelInterfaceComponent {
  constructor(
    private router: Router,
    private dataSharingService: DataSharingService
  ) {}

  handleDropdownSelection(event: any) {
    this.dataSharingService.setDropdownData(event.index, event.label);
  }

  handleObservationChanged(observationEntries: ObservationEntry[]): void {
    this.dataSharingService.setObservationData(observationEntries);
  }

  navigateToSecondInterface(): void {
    this.router.navigate(['/vehicle-personnel-interface']);
  }
}