import { Component } from '@angular/core';


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  
  
})


export class DropdownComponent {
  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    console.log('Opción seleccionada:', value);
  }
}