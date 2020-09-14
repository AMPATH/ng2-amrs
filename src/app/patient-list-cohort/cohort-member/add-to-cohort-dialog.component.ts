/* tslint:disable:no-inferrable-types */
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { style } from '@angular/animations';
import { AddCohortMemberComponent } from './add-cohort-member.component';

@Component({
  selector: 'add-to-cohort-dialog',
  templateUrl: 'add-to-cohort-dialog.component.html',
  styleUrls: ['add-to-cohort-dialog.component.css']
})
export class AddToCohortDialogComponent implements OnInit {
  @Output()
  public dialogClosed: EventEmitter<any> = new EventEmitter();

  @Input()
  public patient: any;

  @Input()
  public cohort: any;

  @Input()
  public allowPatientEdit = false;

  @Input()
  public allowCohortEdit = false;

  @ViewChild('addCohortComp')
  public cohortComponent: AddCohortMemberComponent;

  @ViewChild('addCohortDialog')
  public addCohortDialog: ElementRef;

  private _display = true;
  public get display(): boolean {
    return this._display;
  }
  public set display(v: boolean) {
    this._display = v;
    if (v === false) {
      this.dialogClosed.next();
    }
  }

  constructor() {}

  public ngOnInit() {
    if (this.allowCohortEdit) {
      this.cohortComponent.showCohortSelectorComponent();
    }

    if (this.allowPatientEdit) {
      this.cohortComponent.showPatientSearchComponent();
    }
  }

  public onSavedCohortMember() {
    this.display = false;
  }

  public showDialog() {
    this.display = true;
  }
}
