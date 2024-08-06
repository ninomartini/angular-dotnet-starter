import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appButtonBusy]'
})
export class ButtonBusyDirective implements OnInit {
  @Input() busyText: string;
  button: any;
  originalButtonInnerHtml: any;
  processingMessage: string;

  constructor(private element: ElementRef) {
  }

  @Input() set appButtonBusy(isBusy: boolean) {
    this.refreshState(isBusy);
  }

  ngOnInit() {
    this.button = this.element.nativeElement;
  }

  refreshState(isBusy: boolean) {
    if (!this.button) {
      return;
    }

    if (isBusy) {
      this.originalButtonInnerHtml = this.button.innerHTML;

      // disable button
      this.button.setAttribute('disabled', true);

      this.button.innerHTML = '<i class="fa fa-spin fa-spinner"></i>'
        + '<span> ' + (this.busyText ? this.busyText : 'Processing') + '</span>';

      this.button.setAttribute('_disabledBefore', true);
    } else {
      if (!this.button.getAttribute('_disabledBefore')) {
        return;
      }

      // enable button
      this.button.removeAttribute('disabled');
      this.button.innerHTML = this.originalButtonInnerHtml;
    }
  }

}
