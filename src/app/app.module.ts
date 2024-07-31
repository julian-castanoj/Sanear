import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';


import { AppComponent } from './app.component';
import { DropdownComponent } from '../app/hours-personnel/dropdown/dropdown.component';
import { PersonnelManagerComponent } from '../app/hours-personnel/personnel-manager/personnel-manager.component';
import { CheckTransportComponent } from '../app/hours-personnel/check-transport/check-transport.component';

import { SheetsService } from '../app/hours-personnel/services/sheet.service';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes'; 

import { VehiclePersonnelInterfaceComponent } from './vehicle-personnel/vehicle-personnel-interface/vehicle-personnel-interface.component';
import { VehicleManagementModule } from './vehicle-personnel/app.vehicle-module';

  @NgModule({
    declarations: [
      
      VehiclePersonnelInterfaceComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      MatFormFieldModule,
      AppRoutingModule,
      VehicleManagementModule     
    ],
  providers: [
    SheetsService,
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
