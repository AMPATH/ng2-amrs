import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-locator-pretty-viewer',
  templateUrl: './locator-pretty-viewer.component.html',
  styleUrls: ['./locator-pretty-viewer.component.css']
})
export class LocatorPrettyViewerComponent implements OnInit {
  @Input() locatorData: any;
  data: any;
  constructor() {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    if (this.locatorData) {
      const { obs, patient } = this.locatorData.existingOrders;

      if (patient) {
        const { person } = patient;
        this.data = {
          obs,
          person
        };
      }
    }
  }
}
