import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, forwardRef } from '@angular/core';
import { SheetsService } from '../../services/sheets.service';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

export class VehiclePlateSelectorComponent implements OnInit, OnChanges, ControlValueAccessor {
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
          // Filtrar opciones y eliminar opciones vacías o nulas
          this.options = data.filter(option => !!option); // Esto elimina opciones vacías y nulas

          if (this.options.length > 0) {
            this.ngModel = this.options[0];
            this.onChange(this.ngModel);
            this.ngModelChange.emit(this.ngModel);
            console.log(data);
          }
        },
        (error: any) => {
          console.error('Error fetching column data:', error);
        }
      );
    }
  }

  onSelectionChange(value: any): void {
    this.ngModelChange.emit(value);
    this.onChange(value);
    this.onTouched();
  }

  // ControlValueAccessor methods
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
    // Implement if necessary
  }
}