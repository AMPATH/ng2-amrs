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
    this.showSuccefulEidPosting(3);
  }

  public onSearchReset(event) {
    this.reset = true;
    this.order = null;
  }

  private showSuccefulEidPosting(secondsToDisplay: number) {
    this.orderPosted = true;
    // hide after 3 seconds
    setTimeout(() => {
      this.orderPosted = false;
    }, secondsToDisplay * 1000);
  }
}
