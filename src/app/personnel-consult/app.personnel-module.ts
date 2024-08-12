import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PersonSelectComponent } from '../personnel-consult/person-select/person-select.component';
import { PersonnelConsultComponent } from './personnel-consult.component';
import { DataRangeComponent } from './data-range/data-range.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule
  ],
  declarations: [  
    PersonnelConsultComponent, 
    PersonSelectComponent,
    DataRangeComponent
  ],
  exports: [  
    PersonnelConsultComponent,
    DataRangeComponent
  ]
})
export class PersonnelConsultModule {}