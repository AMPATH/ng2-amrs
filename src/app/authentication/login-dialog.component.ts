import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { LoginComponent } from './login.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  entryComponents: [LoginComponent, ModalComponent],
  encapsulation: ViewEncapsulation.None
})
export class LoginDialogComponent implements OnInit {
  @Output() public closeEvent = new EventEmitter();

  @ViewChild('loginComponent') public loginComponent: LoginComponent;

  @ViewChild('modal')
  public modal: ModalComponent;

  public cssClass = 'login-dialog';

  constructor() {}

  public ngOnInit() {
    // this.open();
  }

  public open() {
    this.modal.open();
  }

  public onLoginSuccess(evt) {
    // TODO - display a success message
    this.modal.close();
    this.closeEvent.emit(true);
    return false;
  }
}
