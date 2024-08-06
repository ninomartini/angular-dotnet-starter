import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Component({
  selector: 'app-text-input-only',
  templateUrl: './text-input-only.component.html',
  styleUrls: ['./text-input-only.component.scss']
})
export class TextInputOnlyComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() ngxMask = '';

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
