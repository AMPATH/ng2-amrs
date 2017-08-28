import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { UsefulLinksService } from './useful-links.service';

@Component({
  selector: 'useful-links',
  templateUrl: 'useful-links.html',
  styleUrls: ['useful-links.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsefulLinksComponent implements OnInit {
  public nativeWindow: any;

  private _links = [
    {
      url: 'https://wiki.ampath.or.ke/display/POC/Versions+Of+POC+Troubleshooting+Manual',
      title: 'POC General Troubleshooting Manual (PDF)'
    },
    {
      url: 'https://wiki.ampath.or.ke/display/ACPS/AMPATH+Clinical+Protocols+and+SOPs',
      title: 'AMPATH Clinical Protocols and SOPs'
    },
    {
      url: 'https://wiki.ampath.or.ke/display/POC/AMPATHPlus+Master+Facility+List+-+MFL',
      title: 'AMPATH Master Facility List - MFL'
    },
    {
      url: 'https://wiki.ampath.or.ke/display/ATG/AMPATH+TB+Guidelines+Home',
      title: 'TB Guidelines '
    },
    {
      url: 'https://wiki.ampath.or.ke/display/POC/POC+Release+Notes',
      title: 'POC Release Notes '
    },
    {
      url: 'https://wiki.ampath.or.ke/display/POC/AMPATHPlus+Master+Facility+List+-+MFL',
      title: 'MFL Wiki'
    }
  ];
  constructor(private linksService: UsefulLinksService) {
    this.nativeWindow = linksService.getNativeWindow();
  }

  public ngOnInit() {
  }

  public goToLink(link: string) {
    let newWindow = this.nativeWindow.open('/');
    newWindow.location.href = link;
  }

  public goBack() {
    this.nativeWindow.history.back();
  }

  get externalLinks(): Array<any> {
    return this._links;
  }

}
