/* tslint:disable:no-output-on-prefix */

import {
  Component,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { ProgramWizardStepComponent } from './program-wizard-step.component';

@Component({
  selector: 'program-wizard',
  template: `<div class="wizard">
    <ng-content></ng-content>
  </div>`,
  styleUrls: []
})
export class ProgramWizardComponent implements AfterContentInit {
  @ContentChildren(ProgramWizardStepComponent)
  public wizardSteps: QueryList<ProgramWizardStepComponent>;
  @Input()
  public set showNext(yes) {
    this._showNext = yes;
    if (yes) {
      this.next();
    }
  }

  public get showNext() {
    return this._showNext;
  }

  @Input()
  public set skipTo(stepIndex) {
    if (stepIndex > 0) {
      this._skipTo = stepIndex;

      const next = this.steps[stepIndex - 1];
      if (next) {
        this.goToStep(next);
      }
    }
  }

  public get skipTo() {
    return this._skipTo;
  }

  @Input()
  public set showPrev(yes) {
    this._showPrev = yes;
    if (yes) {
      this.previous();
    }
  }

  public get showPrev() {
    return this._showPrev;
  }

  @Output() public onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public onStepChanged: EventEmitter<
    ProgramWizardStepComponent
  > = new EventEmitter<ProgramWizardStepComponent>();

  private _steps: Array<ProgramWizardStepComponent> = [];
  private _showPrev = false;
  private _showNext = false;
  private _skipTo = -1;

  constructor() {}

  public ngAfterContentInit() {
    this.wizardSteps.forEach((step) => this._steps.push(step));
    if (this.skipTo > 0) {
      const next = this.steps[this.skipTo - 1];
      if (next) {
        this.goToStep(next);
      }
    } else {
      this.steps[0].isActive = true;
    }
  }

  get steps(): Array<ProgramWizardStepComponent> {
    return this._steps.filter((step) => !step.hidden);
  }

  get currentStep(): ProgramWizardStepComponent {
    return this.steps.find((step) => step.isActive);
  }

  set currentStep(step: ProgramWizardStepComponent) {
    if (step !== this.currentStep) {
      if (this.currentStep) {
        this.currentStep.isActive = false;
      }
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  public get currentStepIndex(): number {
    return this.steps.indexOf(this.currentStep);
  }

  public get hasNextStep(): boolean {
    return this.currentStepIndex < this.steps.length - 1;
  }

  public get hasPrevStep(): boolean {
    return this.currentStepIndex > 0;
  }

  public goToStep(step: ProgramWizardStepComponent): void {
    step.hidden = false;
    this.currentStep = step;
  }

  public next(): void {
    if (this.hasNextStep) {
      const nextStep: ProgramWizardStepComponent = this.steps[
        this.currentStepIndex + 1
      ];
      this.currentStep.onNext.emit();
      this.currentStep = nextStep;
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      const prevStep: ProgramWizardStepComponent = this.steps[
        this.currentStepIndex - 1
      ];
      this.currentStep.onPrev.emit();
      this.currentStep = prevStep;
    }
  }
}
