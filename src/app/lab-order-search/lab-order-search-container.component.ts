import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lab-order-search-container',
  templateUrl: './lab-order-search-container.component.html',
})
export class LabOrderSearchContainerComponent implements OnInit {

  public order: any;
  public orderPosted: boolean = false;
  public reset: boolean = false;

  constructor() {
  }

  public ngOnInit() {
  }

  public orderReceieved(order) {
    this.reset = false;
    this.order = order;
  }

  public onOrderPosted() {
    this.orderPosted = true;
  }

  public onSearchReset(event) {
    this.reset = true;
    this.order = null;
  }
}
