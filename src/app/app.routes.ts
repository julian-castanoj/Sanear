import { Routes, RouterModule } from '@angular/router';
import {NgModule } from '@angular/core'
import { HoursPersonnelInterfaceComponent } from '../app/hours-personnel/hours-personnel-interface/hours-personnel-interface.component';
import { VehiclePersonnelInterfaceComponent } from '../app/vehicle-personnel/vehicle-personnel-interface/vehicle-personnel-interface.component';
import { PersonnelConsultComponent } from './personnel-consult/personnel-consult.component';
import { ConsolidatedFortnightComponent } from './consolidated-fortnight/consolidated-fortnight.component';
import { LoginComponent } from './common-components/login/login.component';
import { AuthguardService } from './common-components/auth/authguard.service';



export const routes: Routes = [
  { path: '', redirectTo: '/primera-interfaz', pathMatch: 'full' },
  { path: 'primera-interfaz', component: HoursPersonnelInterfaceComponent },
  { path: 'segunda-interfaz', component: VehiclePersonnelInterfaceComponent },
  { path: 'consultas', component: PersonnelConsultComponent },
  { path: 'consolidado', component: ConsolidatedFortnightComponent, canActivate: [AuthguardService] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/primera-interfaz' }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})


export class AppRoutingModule { }