import { Component, OnInit, OnDestroy } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { HivPatientClinicalSummaryService } from './hiv-patient-clinical-summary.service';
import { PatientService } from '../patient.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {
  HivPatientClinicalSummaryResourceService
} from '../../etl-api/hiv-patient-clinical-summary-resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hiv-patient-clinical-summaries',
  templateUrl: 'hiv-patient-clinical-summary.component.html'
})
export class HivPatientClinicalSummaryComponent implements OnInit, OnDestroy {

  public pdfSrc: string = null; // 'https://vadimdez.github.io/ng2-pdf-viewer/pdf-test.pdf';
  public page: number = 1;
  public securedUrl: SafeResourceUrl;
  public isBusy: boolean = false;
  public patient: Patient = new Patient({});
  public pdfProxy: PDFDocumentProxy = null;
  public pdfMakeProxy: any = null;
  public errorFlag: boolean = false;
  subscription: Subscription;

  constructor(private patientClinicalSummary: HivPatientClinicalSummaryService,
              private patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService,
              private patientService: PatientService,
              private domSanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.generatePdf();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public  generatePdf(): void {
    this.isBusy = true;
    this.errorFlag = false;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      patient => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.patientClinicalSummaryResource.fetchPatientSummary(patient.uuid).subscribe(
            (pdfDependencies) => {
              if (pdfDependencies) {
                pdfDependencies.patient = patient;
                this.patientClinicalSummary.generatePdf(pdfDependencies).subscribe(
                  (pdf) => {
                    this.pdfSrc = pdf.pdfSrc;
                    this.pdfMakeProxy = pdf.pdfProxy;
                    this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
                    this.isBusy = false;
                  },
                  (err) => {
                    console.log(err);
                    this.errorFlag = true;
                    this.isBusy = false;
                  }
                );
              }
            }, (err) => {
              this.errorFlag = true;
              this.isBusy = false;
              console.log(err);
            });

        }

      });
  }

  public afterLoadCompletes(pdf: PDFDocumentProxy): void {
    // do anything with "proxy"
    this.pdfProxy = pdf;
  }

  public printSummary(): void {
    this.pdfMakeProxy.print();
  }

  public downloadPdf(): void {
    this.pdfMakeProxy
      .download((this.patient.display || 'patient_summary') + '.pdf');
  }

  public nextPage(): void {
    this.page++;
  }

  public prevPage(): void {
    this.page--;
  }


}
