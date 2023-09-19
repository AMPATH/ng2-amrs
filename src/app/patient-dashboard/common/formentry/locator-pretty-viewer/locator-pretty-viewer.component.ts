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
      console.log('person', this.data.person);
    }
  }

  generatePDF() {
    const printContents = document.getElementById('wrapper-container');

    // Check if the element exists
    if (!printContents) {
      console.error('Element with id "wrapper-container" not found.');
      return;
    }

    const contentToPrint = printContents.innerHTML;
    const popupWin = window.open(
      '',
      '_blank',
      'top=0,left=0,height=100%,width=auto'
    );

    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Locator Map Details</title>
          <link rel="stylesheet" type="text/css" href="locator-pretty-viewer.component.css">
        </head>
        <body>${contentToPrint}</body>
      </html>
    `);
    popupWin.document.close();

    // Use an event listener to trigger the print and close actions
    popupWin.addEventListener('load', () => {
      popupWin.print();
      popupWin.close();
    });
  }

  extractValueFromDisplay(display: string): string {
    const parts = display.split('=');
    return parts.length === 2 ? parts[1].trim() : display;
  }
}
