import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() rows = 4;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }
}
