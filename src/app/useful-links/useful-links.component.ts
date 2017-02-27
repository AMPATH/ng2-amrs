import { Component, OnInit } from '@angular/core';

import { UsefulLinksService } from './useful-links.service';


@Component({
  selector: 'useful-links',
  templateUrl: 'useful-links.html',
  styleUrls: ['useful-links.css']
})
export class UsefulLinksComponent implements OnInit {
  nativeWindow: any;
  constructor(private linksService: UsefulLinksService) {
    this.nativeWindow = linksService.getNativeWindow();
  }

  ngOnInit() {}

  goToLink(link: string) {
    let newWindow = this.nativeWindow.open('/');
    newWindow.location.href = link;
  }

  get externalLinks(): Array<any> {
    return [
      {
        url: `https://wiki.ampath.or.ke/display/POC/POC+General+Troubleshooting+Manual
        ?preview=/100302910/100302914/Troubleshooting%20POC%20Errors.pdf`,
        title: 'POC General Troubleshooting Manual(PDF)'
      },
      {
        url: `https://wiki.ampath.or.ke/display/POC/POC+General+Troubleshooting+Manual`,
        title: 'POC General Troubleshooting Manual'
      }
    ];
  }

}
