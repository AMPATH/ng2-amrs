import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
  selector: "program-wizard-header",
  template: `
    <div class="component-header">
      <div class="headline {{ customClass }}">
        <h1 class="component-title">{{ title }}</h1>
        <span class="step-counter pull-right">
          <span
            *ngFor="let step of steps"
            [ngClass]="{ done: step <= currentStep }"
          ></span>
        </span>
        <span class="clear"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .component-header span {
        margin-right: 0;
      }
    `,
    `
      .component-header .headline {
        position: relative;
      }
    `,
    `
      .step-counter {
        position: absolute;
        top: 10px;
        right: 0;
      }
    `,
    `
      .step-counter span {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-left: 10px;
        margin-right: 0;
        background-color: #d8d8d8;
        border-radius: 100%;
      }
    `,
    `
      .step-counter span.done {
        background-color: #425da2;
      }
    `,
    `
      .component-title {
        text-transform: none;
        border-bottom-width: 2px;
      }
    `,
  ],
})
export class ProgramWizardHeaderComponent implements OnInit {
  @Input() public title: string;
  @Input() public steps: number[] = [];
  @Input() public currentStep: number;
  @Input() public customClass: string;

  constructor() {}

  public ngOnInit() {}
}
