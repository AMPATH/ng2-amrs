import { Component } from '@angular/core';
import { IAfterGuiAttachedParams } from 'ag-grid';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'family-testing-button',
  template: `<button
    type="button"
    style="border:none; margin:0 2px 2px 0; width:75px; background-color:#337ab7; color: white"
    (click)="onClick($event)"
  >
    {{ label }}
  </button>`
})
export class FamilyTestingButtonRendererComponent
  implements ICellRendererAngularComp {
  params;
  label: string;
  buttonType: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
    this.buttonType = this.params.buttonType || '';
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      };
      this.params.onClick(params);
    }
  }
  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }
}
