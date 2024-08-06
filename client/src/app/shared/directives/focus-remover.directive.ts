import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'button, a'
})
export class FocusRemoverDirective {

  constructor(private elRef: ElementRef) {
  }

  @HostListener('click') onClick() {
    this.elRef.nativeElement.blur();
  }
}
