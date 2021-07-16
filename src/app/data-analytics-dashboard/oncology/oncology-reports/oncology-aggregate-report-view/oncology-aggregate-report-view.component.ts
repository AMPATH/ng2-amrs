import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnDestroy,
  OnChanges,
} from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

import { take } from "rxjs/operators";
import { Subscription } from "rxjs";

import { PDFDocumentProxy } from "pdfjs-dist";

import { OncologyReportPdfService } from "../oncology-report-pdf-view/oncology-report-pdf.service";

@Component({
  selector: "oncology-aggregate-report-view",
  templateUrl: "./oncology-aggregate-report-view.component.html",
  styleUrls: ["./oncology-aggregate-report-view.component.css"],
})
export class OncologyAggregateReportViewComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() public title: String;
  @Input() public monthlySummary: Array<any> = [];
  @Input() public params: any;
  @Input() public currentView: String;
  public pdfSrc: string = null;
  public page = 1;
  public isBusy = false;
  public securedUrl: SafeResourceUrl;
  public pdfProxy: PDFDocumentProxy = null;
  public pdfMakeProxy: any = null;
  public StartDate: any = null;
  public EndDate: any = null;
  public errorFlag = false;
  private subscription: Subscription;
  public data: Array<any> = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private oncologyReportPdfService: OncologyReportPdfService
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.monthlySummary) {
      this.generatePdf();
    }
  }

  fetchReport() {
    throw new Error("Method not implemented");
  }

  public generatePdf(): void {
    if (this.monthlySummary.length > 0) {
      this.subscription = this.oncologyReportPdfService
        .generateAggregatePdf(this.monthlySummary, this.params, this.title)
        .pipe(take(1))
        .subscribe(
          (pdf) => {
            this.pdfSrc = pdf.pdfSrc;
            this.pdfMakeProxy = pdf.pdfProxy;
            this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.pdfSrc
            );
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }

  public afterLoadCompletes(pdf: PDFDocumentProxy): void {
    this.pdfProxy = pdf;
  }

  public printReport(): void {
    this.pdfMakeProxy.print();
  }

  public downloadPdf(): void {
    this.pdfMakeProxy.download(
      (this.title + " aggregateReport" || "onc_report") + ".pdf"
    );
  }

  public nextPage(): void {
    this.page++;
  }

  public prevPage(): void {
    this.page--;
  }
}
