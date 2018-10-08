import {
  Component, OnInit, Input, ViewChild, Output, EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { style } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { ProgramsTransferCareService } from './transfer-care.service';

@Component({
  selector: 'transfer-care-dialog',
  templateUrl: 'transfer-care-dialog.component.html',
  styleUrls: ['transfer-care-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TransferCareDialogComponent implements OnInit {
  @Input()
  public showFormWizard: boolean = false;
  @Output()
  public dialogClosed: EventEmitter<any> = new EventEmitter();

  private _display: boolean = true;
  public get display(): boolean {
    return this._display;
  }
  public set display(v: boolean) {
    this._display = v;
    if (v === false) {
      this.dialogClosed.next();
    }
  }

  constructor(private route: ActivatedRoute,
    private transferCareService: ProgramsTransferCareService) { }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.completeEnrollment) {
        this.transferCareService.transferFromModal(true);
        this.showFormWizard = true;
      }
    });
  }

  public goToFormWizard() {
    this.showFormWizard = true;
  }

  public showDialog() {
    this.display = true;
  }

  public hideDialog() {
    this.display = false;
  }

}
