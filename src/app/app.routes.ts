import { Routes, RouterModule } from '@angular/router';
import {NgModule } from '@angular/core'
import { DropdownComponent } from '../app/hours-personnel/dropdown/dropdown.component';
import { HoursPersonnelInterfaceComponent } from '../app/hours-personnel/hours-personnel-interface/hours-personnel-interface.component';


export const routes: Routes = [
    { path: '', redirectTo: '/primera-interfaz', pathMatch: 'full' },
    { path: 'primera-interfaz', component: HoursPersonnelInterfaceComponent },
  ];

@NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]

})


export class AppRoutingModule { }