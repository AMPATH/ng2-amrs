import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'busy',
  template: `<div class="loader">
    <div class="message">
      <i class="fa fa-spinner fa-spin"></i>
      <strong *ngIf="message">{{ message }}</strong>
      <strong *ngIf="!message">Loading...</strong>
    </div>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
      :host.small {
        margin-top: -15px;
      }
      .loader {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        z-index: 9;
        box-sizing: border-box;
        background-color: #fff;
        color: #fff;
        opacity: 0.8;
      }

      .loader .fa:before {
        margin-right: 12px;
        display: inline-block;
      }

      .loader .message {
        padding: 12px;
        background-color: #0d6aad;
        border-radius: 6px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
      }

      :host.small .loader .message {
        font-size: 12px;
        padding: 7px;
      }

      .fa-spin {
        width: 16px;
        margin-right: 8px;
      }
    `
  ]
})
export class BusyComponent implements OnInit {
  @Input('message') public message: string;
  constructor() {}

  public ngOnInit() {}
}
