import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, forwardRef } from '@angular/core';
import { SheetsService } from '../../services/sheets.service';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlateServiceService } from '../../services/plate-service.service'; // Importar el servicio de plates
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-plate-selector',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vehicle-plate-selector.component.html',
  styleUrl: './vehicle-plate-selector.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VehiclePlateSelectorComponent),
      multi: true
    }
  ]
})

export class VehiclePlateSelectorComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() id: any;
  @Input() columnIndex: number = 0;
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();

  options: string[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private sheetsService: SheetsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnIndex'] && changes['columnIndex'].currentValue !== undefined) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (this.columnIndex !== undefined) {
      this.sheetsService.getDataForColumn(this.columnIndex).subscribe(
        (data: string[]) => {
          this.options = data.filter(option => !!option); 
          if (this.options.length > 0) {
            this.ngModel = this.options[0];
            this.onChange(this.ngModel);
            this.emitNgModelChange(this.ngModel); // Emitir el valor inicial de ngModel
          }
        },
        (error: any) => {
          console.error('Error fetching column data:', error);
        }
      );
    }
  }

  onSelectionChange(value: any): void {
    this.emitNgModelChange(value); // Emitir cambios de ngModel al padre
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.ngModel = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Lógica opcional para manejar el estado deshabilitado
  }

  private emitNgModelChange(value: any): void {
    this.ngModelChange.emit(value);
  }
}