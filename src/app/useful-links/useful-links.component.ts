import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { UsefulLinksService } from './useful-links.service';


@Component({
  selector: 'useful-links',
  templateUrl: 'useful-links.html',
  styleUrls: ['useful-links.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsefulLinksComponent implements OnInit {
  nativeWindow: any;
  constructor(private linksService: UsefulLinksService) {
    this.nativeWindow = linksService.getNativeWindow();
  }

  ngOnInit() { }

  goToLink(link: string) {
    let newWindow = this.nativeWindow.open('/');
    newWindow.location.href = link;
  }

  get externalLinks(): Array<any> {
    return [
      {
        url: `https://wiki.ampath.or.ke/display/POC/Versions+Of+POC+Troubleshooting+Manual
        ?preview=/100302910/100794483/Troubleshooting%20POC%20Errors%2020170303.pdf`,
        title: 'POC General Troubleshooting Manual (PDF)'
      },
      {
        url: 'https://wiki.ampath.or.ke/display/ACPS/AMPATH+Clinical+Protocols+and+SOPs',
        title: 'AMPATH Clinical Protocols and SOPs'
      }
    ];
  }

}
