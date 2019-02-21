import {BaseModel} from './base-model.model';
import {serializable} from './serializable.decorator';
import {Program} from './program.model';
import {DatePipe} from '@angular/common';
import {TitleCasePipe} from '../shared/pipes/title-case.pipe';

export class ProgramEnrollment extends BaseModel {
  private _program: Program;
  private _location: any;
  private _dateEnrolled: Date;
  private _dateCompleted: Date;
  private _datePipe: DatePipe;
  private _titleCasePipe: TitleCasePipe;

  constructor(openmrsModel?: any) {
    super(openmrsModel);
    this._datePipe = new DatePipe('en-US');
    this._titleCasePipe = new TitleCasePipe();

  }

  @serializable(true, false)
  public get program(): Program {
    if (this._program === null || this._program === undefined) {
      this.initializeNavigationProperty('program');
      this._program = new Program(this._openmrsModel.program);
    }
    return this._program;
  }

  public set program(v: Program) {
    this._openmrsModel.program = v.openmrsModel;
    this._program = v;
  }
  @serializable()
  public get display(): string {
    return this._titleCasePipe.transform(this._openmrsModel.display);
  }

  public set display(v: string) {
    this._openmrsModel.display = v;
  }

  public get location(): any {
    return this._openmrsModel.location;
  }

  public get states(): any {
    return this._openmrsModel.states;
  }

  public get programUuid(): string {
    return this._openmrsModel.program.uuid;
  }

  public get voided(): boolean {
    return this._openmrsModel.voided;
  }

  @serializable()
  public get dateEnrolled(): Date {
    if (this._dateEnrolled === null || this._dateEnrolled === undefined) {
      this._dateEnrolled = this.resolveDate(this._openmrsModel.dateEnrolled);
    }
    return this._dateEnrolled;
  }

  public set dateEnrolled(v: Date) {
    this._openmrsModel.dateEnrolled = v.toServerTimezoneString();
    this._dateEnrolled = v;
  }

  @serializable()
  public get dateCompleted(): Date {
    if (this._dateCompleted === null || this._dateCompleted === undefined) {
      this._dateCompleted = this.resolveDate(this._openmrsModel.dateCompleted);
    }
    return this._dateCompleted;
  }

  public set dateCompleted(v: Date) {
    this._openmrsModel.dateCompleted = v.toServerTimezoneString();
    this._dateCompleted = v;
  }

  private resolveDate(date) {
    const dateFormat = 'MMM dd, yyyy';
    const parsedDate = Date.parse(date);
    return isNaN(parsedDate) ? date : this._datePipe.transform(date, dateFormat);
  }

}
