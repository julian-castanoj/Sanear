import { Routes, RouterModule } from '@angular/router';
import {NgModule } from '@angular/core'
import { DropdownComponent } from './dropdown/dropdown.component';


export const routes: Routes = [
{
    path: 'app-dropdown',
    component: DropdownComponent
}
];

@NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]

})


export class AppRoutingModule { }