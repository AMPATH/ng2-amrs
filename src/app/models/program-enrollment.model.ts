import { BaseModel } from './base-model.model';
import { serializable } from './serializable.decorator';
import { Program } from './program.model';

export class ProgramEnrollment extends BaseModel {
  private _program: Program;
  private _dateEnrolled: Date;
  private _dateCompleted: Date;

  constructor(openmrsModel?: any) {
    super(openmrsModel);
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
    return this._openmrsModel.display;
  }

  public set display(v: string) {
    this._openmrsModel.display = v;
  }


  @serializable()
  public get dateEnrolled(): Date {
    if (this._dateEnrolled === null || this._dateEnrolled === undefined) {
      this._dateEnrolled = new Date(this._openmrsModel.dateEnrolled);
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
      this._dateCompleted = new Date(this._openmrsModel.dateCompleted);
    }
    return this._dateCompleted;
  }

  public set dateCompleted(v: Date) {
    this._openmrsModel.dateCompleted = v.toServerTimezoneString();
    this._dateCompleted = v;
  }


}
