import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lab-order-search-container',
  templateUrl: './lab-order-search-container.component.html',
})
export class LabOrderSearchContainerComponent implements OnInit {

  public order: any;
  orderPosted: boolean = false;
  reset: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  orderReceieved(order) {
    this.reset = false;
    this.order = order;
  }

  onOrderPosted() {
    this.orderPosted = true;
  }

  onSearchReset(event) {
    this.reset = true;
    this.order = null;
  }
}
