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
  public currentUrl = window.location;
  public formVisitSearchUrl = '';

  public _links = [
    {
      url:
        'https://ampath.atlassian.net/wiki/spaces/PRN/pages/5013512/POC+General+Troubleshooting+Manual+PDF',
      title: 'POC General Troubleshooting Manual (PDF)'
    },
    {
      url:
        'https://ampath.atlassian.net/wiki/spaces/PRN/pages/5242881/POC+Standard+Operating+Procedures',
      title: 'AMPATH Clinical Protocols and SOPs'
    },
    {
      url:
        'https://ampath.atlassian.net/wiki/spaces/PRN/pages/5373953/TB+Guidelines',
      title: 'TB Guidelines '
    },
    {
      url:
        'https://ampath.atlassian.net/wiki/spaces/PRN/pages/5079041/POC+Release+notes',
      title: 'POC Release Notes '
    },
    {
      url:
        'https://ampath.atlassian.net/jira/software/c/projects/POC/boards/1?modal=detail&selectedIssue=POC-116#:~:text=MFL%20Wiki%20%2D-,MFL%20Wiki,-Information%20on%20Forms',
      title: 'MFL Wiki'
    }
  ];
  constructor(private linksService: UsefulLinksService) {
    this.nativeWindow = linksService.getNativeWindow();
  }

  public ngOnInit() {
    this.getFormVisitSearchUrl();
  }

  public goToLink(link: string) {
    const newWindow = this.nativeWindow.open('/');
    newWindow.location.href = link;
  }

  public getFormVisitSearchUrl() {
    this.formVisitSearchUrl =
      this.currentUrl.href.split('useful-links')[0] + 'form-visit-search';

    this._links.push({
      url: this.formVisitSearchUrl + '',
      title: 'Information on Forms / Visit Type'
    });

    console.log('formvisiturl', this.formVisitSearchUrl);
  }

  public goBack() {
    this.nativeWindow.history.back();
  }

  public getexternalLinks(): Array<any> {
    return this._links;
  }
}
