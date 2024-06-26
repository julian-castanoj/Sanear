import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CreateDataComponent } from './create-data/create-data.component';
import { DataSelectComponent } from './data-select/data-select.component';
import { PersonnelManagerComponent } from './personnel-manager/personnel-manager.component';
import { DataObservationComponent } from './data-observation/data-observation.component';
import { ToRegisterComponent } from './to-register/to-register.component';
import { CheckTransportComponent } from './check-transport/check-transport.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DropdownComponent,
    CreateDataComponent, DataSelectComponent, PersonnelManagerComponent,
    DataObservationComponent, ToRegisterComponent, CheckTransportComponent, NgIf ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showPersonnelManager: boolean = false; 

  onDropdownSelection(selectedIndex: number): void {
    this.showPersonnelManager = true; 
  }
  title = 'Sanear_Encargado';
}