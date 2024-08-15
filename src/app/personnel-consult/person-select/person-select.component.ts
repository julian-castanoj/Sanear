import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-person-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './person-select.component.html',
  styleUrl: './person-select.component.css'
})

export class PersonSelectComponent implements OnChanges {
  @Input() options: { value: string, label: string }[] = [];
  @Output() selectionChange = new EventEmitter<string>();

  selectedValue: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      this.options = this.options.sort((a, b) => {
        const labelA = a.label || '';
        const labelB = b.label || '';
        return labelA.localeCompare(labelB);
      });
    }
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.selectedValue = value;
    this.selectionChange.emit(this.selectedValue);
  }
}