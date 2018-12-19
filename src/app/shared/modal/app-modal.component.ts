import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: []
})
export class AppModalComponent implements OnInit {
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  @Input() public title: string;
  @Input() public set display(state) {
    if (state) {
      this.staticModal.show();
      this.onDisplayed.emit(true);
    } else {
      this.staticModal.hide();
      this.onDisplayed.emit(false);
    }
  }
  /* tslint:disable:no-output-on-prefix */
  @Output() onClose: EventEmitter<boolean> = new EventEmitter(false);
  @Output() onDisplayed: EventEmitter<boolean> = new EventEmitter(false);
  constructor() {}

  public ngOnInit() {
  }

  public closeModal() {
    this.onClose.emit(true);
  }
}
