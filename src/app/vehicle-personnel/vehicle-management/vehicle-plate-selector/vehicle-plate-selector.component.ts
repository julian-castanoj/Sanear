import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vehicle-plate-selector',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-plate-selector.component.html',
  styleUrl: './vehicle-plate-selector.component.css'
})
export class VehiclePlateSelectorComponent {
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();
}
