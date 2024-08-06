import {Component, Input, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from "@angular/forms";

@Component({
  selector: 'app-select-lookup',
  templateUrl: './select-lookup.component.html',
  styleUrls: ['./select-lookup.component.scss']
})
export class SelectLookupComponent implements ControlValueAccessor {
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
