import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, forwardRef } from '@angular/core';
import { SheetsService } from '../../services/sheets.service';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-plate-selector',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vehicle-plate-selector.component.html',
  styleUrls: ['./vehicle-plate-selector.component.css'],
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
          if (this.ngModel === undefined && this.options.length > 0) {
            this.selectOption(this.options[0]);
          }
        },
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  onSelectionChange(value: string): void {
    this.selectOption(value);
  }

  private selectOption(value: string): void {
    this.ngModel = value;
    this.ngModelChange.emit(this.ngModel);
    this.onChange(this.ngModel);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.ngModel = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Opcional: Puedes implementar esta función para manejar el estado deshabilitado.
  }
}