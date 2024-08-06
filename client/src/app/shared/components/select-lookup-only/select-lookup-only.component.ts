import {Component, Input, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from "@angular/forms";

@Component({
  selector: 'app-select-lookup-only',
  templateUrl: './select-lookup-only.component.html',
  styleUrls: ['./select-lookup-only.component.scss']
})
export class SelectLookupOnlyComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() items: any[] = [];
  @Input() lookupLabel: string;
  @Input() lookupValue: string;

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
