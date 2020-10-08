/* tslint:disable:no-output-on-prefix
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'program-wizard-step',
  template: `
    <div [hidden]="!isActive" [ngClass]="{ active: isActive }">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      div.active {
        display: block;
        padding-bottom: 20px;
      }
    `
  ]
})
export class ProgramWizardStepComponent {
  @Input() public name: string;
  @Input() public hidden = false;

  @Output() public onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onPrev: EventEmitter<any> = new EventEmitter<any>();

  private _isActive = false;

  constructor() {}

  @Input('isActive')
  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}
