import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lab-order-search-container',
  templateUrl: './lab-order-search-container.component.html',
})
export class LabOrderSearchContainerComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  orderReceieved(order) {
    console.log('order has been received', order);
  }

}
