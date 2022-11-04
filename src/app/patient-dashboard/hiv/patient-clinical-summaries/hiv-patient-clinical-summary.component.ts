import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { HivPatientClinicalSummaryService } from './hiv-patient-clinical-summary.service';
import { PatientService } from '../../services/patient.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { HivSummaryService } from '../hiv-summary/hiv-summary.service';
import { HivPatientClinicalSummaryResourceService } from '../../../etl-api/hiv-patient-clinical-summary-resource.service';
import { Subscription } from 'rxjs';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'hiv-patient-clinical-summaries',
  styleUrls: ['./hiv-patient-clinical-summary.component.css'],
  templateUrl: './hiv-patient-clinical-summary.component.html'
})
export class HivPatientClinicalSummaryComponent implements OnInit, OnDestroy {
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
    private patientClinicalSummary: HivPatientClinicalSummaryService,
    private patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService,
    private patientService: PatientService,
    private domSanitizer: DomSanitizer,
    private hivSummaryService: HivSummaryService
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
          this.hivSummaryService
            .getHivSummary(patient.uuid, 0, 1, false)
            .subscribe((data) => {
              if (data) {
                for (const summary of data) {
                  this.patientClinicalSummaryResource
                    .fetchPatientSummary(patient.uuid)
                    .pipe(take(1))
                    .subscribe(
                      (pdfDependencies) => {
                        if (pdfDependencies) {
                          pdfDependencies.patient = patient;
                          pdfDependencies.summaryEndDate =
                            summary.ipt_start_date;
                          pdfDependencies.summaryStartDate =
                            summary.ipt_stop_date;
                          this.patientClinicalSummary
                            .generatePdf(pdfDependencies)
                            .pipe(take(1))
                            .subscribe(
                              (pdf) => {
                                this.pdfSrc = pdf.pdfSrc;
                                this.pdfMakeProxy = pdf.pdfProxy;
                                this.securedUrl =
                                  this.domSanitizer.bypassSecurityTrustResourceUrl(
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
