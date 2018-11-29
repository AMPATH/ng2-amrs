import { VitalViewInterface } from './vital-view.interface';
import { Vital } from '../../../models/vital.model';

export class VitalView implements VitalViewInterface {
  public label: string;
  public color: string;
  public vital: Vital;
  public name: string;
  public order: number;
  public show = true;
  public compoundValue: any;
  public isCompoundedWith: string;
  private _value: string | number;

  constructor(options) {
    this.color = options.color;
    this.value = options.value;
    this.label = options.label;
    this.name = options.name;
    // set the default order far from 0
    this.order = options.order || 100;
    this.show = options.show === undefined ? this.show : options.show;
    this.compoundValue = options.compoundValue || null;
    this.isCompoundedWith = options.isCompoundedWith || null;
  }

  public set value(v: string | number) {
    this._value = v;
  }
  public get value() {
    return this._value;
  }
}
