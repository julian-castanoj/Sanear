import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CreateDataComponent } from './create-data/create-data.component'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownComponent } from './dropdown/dropdown.component';
import { PersonnelManagerComponent } from './personnel-manager/personnel-manager.component';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    AppComponent,
    BrowserAnimationsModule,
    DropdownComponent,
    PersonnelManagerComponent
    
    
  ],
  imports: [
    BrowserModule,
    CreateDataComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule ,
    
    
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
