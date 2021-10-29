import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { CdmClinicalSummaryService } from './cdm-clinical-summary.service';
import { CdmSummaryService } from '../cdm-summary/cdm-summary.service';
import { CdmSummaryResourceService } from 'src/app/etl-api/cdm-summary-resource.service';

@Component({
  selector: 'cdm-clinical-summaries',
  styleUrls: ['./cdm-clinical-summary.component.css'],
  templateUrl: './cdm-clinical-summary.component.html'
})
export class CdmClinicalSummaryComponent implements OnInit, OnDestroy {
  public pdfSrc: string = null; // 'https://vadimdez.github.io/ng2-pdf-viewer/pdf-test.pdf';
  public page = 1;
  public securedUrl: SafeResourceUrl;
  public isBusy = false;
  public patient: Patient = new Patient({});
  public pdfProxy: PDFDocumentProxy = null;
  public pdfMakeProxy: any = null;
  public summaryStartDate: any = null;
  public summaryEndDate: any = null;
  public errorFlag = false;
  private subscription: Subscription;

  constructor(
    private patientClinicalSummary: CdmClinicalSummaryService,
    private patientClinicalSummaryResource: CdmSummaryResourceService,
    private patientService: PatientService,
    private domSanitizer: DomSanitizer,
    private cdmSummaryService: CdmSummaryService
  ) {}

  public ngOnInit() {
    this.generatePdf();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public generatePdf(): void {
    this.isBusy = true;
    this.errorFlag = false;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.cdmSummaryService
            .getCdmSummary(patient.uuid, 0, 1, false)
            .subscribe((data) => {
              if (data) {
                for (const summary of data) {
                  this.patientClinicalSummaryResource
                    .getCdmSummary(patient.uuid, 0, 1, false)
                    .pipe(take(1))
                    .subscribe(
                      (pdfDependencies) => {
                        if (pdfDependencies) {
                          pdfDependencies.patient = patient;
                          this.patientClinicalSummary
                            .generatePdf(pdfDependencies)
                            .pipe(take(1))
                            .subscribe(
                              (pdf) => {
                                this.pdfSrc = pdf.pdfSrc;
                                this.pdfMakeProxy = pdf.pdfProxy;
                                this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
                                  this.pdfSrc
                                );
                                this.isBusy = false;
                              },
                              (err) => {
                                console.error(err);
                                this.errorFlag = true;
                                this.isBusy = false;
                              }
                            );
                        }
                      },
                      (err) => {
                        this.errorFlag = true;
                        this.isBusy = false;
                        console.error(err);
                      }
                    );
                  break;
                }
              }
            });
        }
      }
    );
  }

  public afterLoadCompletes(pdf: PDFDocumentProxy): void {
    // do anything with "proxy"
    this.pdfProxy = pdf;
  }

  public printSummary(): void {
    this.pdfMakeProxy.print();
  }

  public downloadPdf(): void {
    this.pdfMakeProxy.download(
      (this.patient.display || 'patient_summary') + '.pdf'
    );
  }

  public nextPage(): void {
    this.page++;
  }

  public prevPage(): void {
    this.page--;
  }
}
