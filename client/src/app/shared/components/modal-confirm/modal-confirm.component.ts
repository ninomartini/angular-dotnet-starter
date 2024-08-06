import { Component, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {
  @Input() title: string;
  @Input() subTitle = '';
  @Input() message = '';
  @Input() messageRaw = '';
  @Input() btnOkText = 'OK';
  @Input() btnOkClass = 'btn btn-primary';
  @Input() btnCancelText = 'Cancel';
  @Input() btnCancelClass = 'btn btn-secondary';

  constructor(private activeModal: NgbActiveModal) {
  }

  close(closeReason: string): void {
    this.activeModal.close(closeReason);
  }
}
