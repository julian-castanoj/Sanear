import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CreateDataComponent } from './create-data/create-data.component';
import { AppComponent } from './app.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { PersonnelManagerComponent } from './personnel-manager/personnel-manager.component';
import { CheckTransportComponent } from './check-transport/check-transport.component';

import { SheetsService } from './services/sheet.service';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DropdownComponent,
    PersonnelManagerComponent,
    CheckTransportComponent,
    CreateDataComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    HttpClientModule,
    


  ],
  providers:
    [
      SheetsService,
      provideHttpClient(withInterceptorsFromDi(), withFetch()),
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
