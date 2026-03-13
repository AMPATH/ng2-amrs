import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  title = 'Confirm';
  message =
    'The patient is 50 years and above. Would you like to proceed and fill the age friendly tool?';

  onConfirm!: () => void;
  onCancel!: () => void;

  constructor(public bsModalRef: BsModalRef) {}

  confirm() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.bsModalRef.hide();
  }

  cancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.bsModalRef.hide();
  }
}
