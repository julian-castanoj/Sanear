import { Routes, RouterModule } from '@angular/router';
import {NgModule } from '@angular/core'
import { HoursPersonnelInterfaceComponent } from '../app/hours-personnel/hours-personnel-interface/hours-personnel-interface.component';
import { VehiclePersonnelInterfaceComponent } from '../app/vehicle-personnel/vehicle-personnel-interface/vehicle-personnel-interface.component';

export const routes: Routes = [
    { path: '', redirectTo: '/primera-interfaz', pathMatch: 'full' },
    { path: 'primera-interfaz', component: HoursPersonnelInterfaceComponent },
    { path: 'segunda-interfaz', component: VehiclePersonnelInterfaceComponent },
  ];

@NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]

})


export class AppRoutingModule { }