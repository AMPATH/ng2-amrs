import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-locator-pretty-viewer',
  templateUrl: './locator-pretty-viewer.component.html',
  styleUrls: ['./locator-pretty-viewer.component.css']
})
export class LocatorPrettyViewerComponent implements OnInit {
  @Input() locatorData: any;

  data: any;
  mappedAttributes: any;
  constructor() {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    if (this.locatorData) {
      const { obs, patient } = this.locatorData.existingOrders;

      if (patient) {
        const {
          person: { attributes }
        } = patient;
        this.data = {
          obs,
          attributes
        };
      }
    }
    this.mappedAttributes = this.generateMappings(this.data);
    console.log('mappedAttributes', this.mappedAttributes);
  }

  generateMappings(data: any) {
    const mappings = {
      obs: {},
      attributes: {}
    };

    if (data) {
      for (const type of ['obs', 'attributes']) {
        if (data[type]) {
          for (const item of data[type]) {
            if (type === 'obs' && item.concept.name.display) {
              mappings[type][item.concept.name.display] =
                item.value.display || item.value;
            } else if (type === 'attributes' && item.display) {
              const parts = item.display.split('=');
              if (parts.length === 2) {
                mappings[type][parts[0].trim()] = parts[1].trim();
              } else {
                mappings[type][item.display] = item.display;
              }
            }
          }
        }
      }
    }
    return mappings;
  }

  generatePDF() {
    const printContents = document.getElementById('wrapper-container');

    if (!printContents) {
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
}
