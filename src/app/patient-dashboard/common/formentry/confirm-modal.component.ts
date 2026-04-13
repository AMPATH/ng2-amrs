import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  title = 'Confirm';
  message =
    'The patient is 50 years and above. Would you like to proceed and fill the age friendly tool?';

  onConfirm!: () => void;
  onCancel!: () => void;

  private confirmed = false;
  private sub!: Subscription;

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.sub = this.modalService.onHidden.subscribe(() => {
      if (!this.confirmed) {
        if (this.onCancel) {
          this.onCancel();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  confirm() {
    this.confirmed = true;
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
