import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { UsefulLinksService } from "./useful-links.service";

@Component({
  selector: "useful-links",
  templateUrl: "useful-links.html",
  styleUrls: ["useful-links.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UsefulLinksComponent implements OnInit {
  public nativeWindow: any;
  public currentUrl = window.location;
  public formVisitSearchUrl = "";

  public _links = [
    {
      url:
        "https://wiki.ampath.or.ke/display/POC/Versions+Of+POC+Troubleshooting+Manual",
      title: "POC General Troubleshooting Manual (PDF)",
    },
    {
      url:
        "https://wiki.ampath.or.ke/display/ACPS/AMPATH+Clinical+Protocols+and+SOPs",
      title: "AMPATH Clinical Protocols and SOPs",
    },
    {
      url: "https://wiki.ampath.or.ke/display/ATG/AMPATH+TB+Guidelines+Home",
      title: "TB Guidelines ",
    },
    {
      url: "https://wiki.ampath.or.ke/display/POC/POC+Release+Notes",
      title: "POC Release Notes ",
    },
    {
      url:
        "https://wiki.ampath.or.ke/display/POC/AMPATHPlus+Master+Facility+List+-+MFL",
      title: "MFL Wiki",
    },
  ];
  constructor(private linksService: UsefulLinksService) {
    this.nativeWindow = linksService.getNativeWindow();
  }

  public ngOnInit() {
    this.getFormVisitSearchUrl();
  }

  public goToLink(link: string) {
    const newWindow = this.nativeWindow.open("/");
    newWindow.location.href = link;
  }

  public getFormVisitSearchUrl() {
    this.formVisitSearchUrl =
      this.currentUrl.href.split("useful-links")[0] + "form-visit-search";

    this._links.push({
      url: this.formVisitSearchUrl + "",
      title: "Information on Forms / Visit Type",
    });

    console.log("formvisiturl", this.formVisitSearchUrl);
  }

  public goBack() {
    this.nativeWindow.history.back();
  }

  public getexternalLinks(): Array<any> {
    return this._links;
  }
}
