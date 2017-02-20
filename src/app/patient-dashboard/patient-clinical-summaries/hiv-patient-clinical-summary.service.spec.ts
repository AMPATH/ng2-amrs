import { TestBed, fakeAsync, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Patient } from '../../models/patient.model';
import { BehaviorSubject } from 'rxjs/Rx';
import { HivPatientClinicalSummaryService } from './hiv-patient-clinical-summary.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';
declare let pdfMake: any;

describe('Service: HivPatientClinicalSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HivPatientClinicalSummaryService,
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of HivPatientClinicalSummaryService', () => {
    let service: HivPatientClinicalSummaryService = TestBed.get(HivPatientClinicalSummaryService);
    expect(service).toBeTruthy();
  });

  it('should initialize correctly when ' +
    'HivPatientClinicalSummaryService is instantiated', () => {
    let service: HivPatientClinicalSummaryService = TestBed.get(HivPatientClinicalSummaryService);
    expect(service.generatePdf).toBeTruthy();
  });


  it('should return correct pdf source (blob object URL), pdf definition, and  pdfProxy',
    (done) => {
      let service: HivPatientClinicalSummaryService = TestBed.get(HivPatientClinicalSummaryService);
      let pdfDependencies: any = {
        patientUuid: 'uuid',
        notes: [],
        vitals: [],
        hivSummaries: [],
        reminders: [],
        labDataSummary: []
      };
      service.generatePdf(pdfDependencies).subscribe(
        (pdf) => {
          expect(pdf.pdfSrc).toBeDefined();
          expect(pdf.pdfDefinition).toBeDefined();
          expect(pdf.pdfProxy).toBeDefined();
          done();
        },
        (err) => {
          expect(err).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
          done();
        }
      );
    }
  );

  it('should return correct pdf definition with the correct object structure needed by pdfMake',
    (done) => {
      let service: HivPatientClinicalSummaryService = TestBed.get(HivPatientClinicalSummaryService);
      let pdfDependencies: any = {
        patientUuid: 'uuid',
        notes: [],
        vitals: [],
        hivSummaries: [],
        reminders: [],
        labDataSummary: []
      };
      service.generatePdf(pdfDependencies).subscribe(
        (pdf) => {
          expect(pdf.pdfSrc).toBeDefined();
          expect(pdf.pdfDefinition).toBeDefined();
          expect(pdf.pdfProxy).toBeDefined();

          // now check the structure
          expect(pdf.pdfDefinition.pageSize).toBeDefined();
          expect(pdf.pdfDefinition.pageMargins).toBeDefined();
          expect(pdf.pdfDefinition.footer).toBeDefined();
          expect(pdf.pdfDefinition.content).toBeDefined();
          expect(pdf.pdfDefinition.styles).toBeDefined();
          expect(pdf.pdfDefinition.defaultStyle).toBeDefined();


          // now check the content
          expect(pdf.pdfDefinition.pageSize).toBe('LETTER'); // should be A4
          expect(pdf.pdfDefinition.pageMargins).toBeGreaterThan(5); // should have a margin GT 5
          expect(pdf.pdfDefinition.content.length)
            .toBeGreaterThan(1); // should have at least 1 section

          done();
        },
        (err) => {
          expect(err).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
          done();
        }
      );
    }
  );

  it('should create pdf url successfully of correct blob type: blob:http://',
    (done) => {
      let service: HivPatientClinicalSummaryService = TestBed.get(HivPatientClinicalSummaryService);
      let pdfDependencies: any = {
        patientUuid: 'uuid',
        notes: [],
        vitals: [],
        hivSummaries: [],
        reminders: [],
        labDataSummary: []
      };
      service.generatePdf(pdfDependencies).subscribe(
        (pdf) => {
          expect(pdf.pdfSrc).toBeDefined();

          // Should create a blob object URL
          expect(pdf.pdfSrc).toContain('blob:http://');

          done();
        },
        (err) => {
          expect(err).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
          done();
        }
      );
    }
  );

  it('should throw error when pdf dependencies is null or undefined',
    (done) => {
      let service: HivPatientClinicalSummaryService = TestBed.get(HivPatientClinicalSummaryService);
      let pdfDependencies: any = null;
      service.generatePdf(pdfDependencies).subscribe(
        (pdf) => {
          expect(pdf).not.toBeDefined(); // this means it has errored, we don't expect this!!!!
          expect(pdf.pdfSrc).not.toBeDefined();
          expect(pdf.pdfDefinition).not.toBeDefined();
          expect(pdf.pdfProxy).not.toBeDefined();

          done();
        },
        (err) => {
          expect(err).toBeDefined(); // this means it has errored, we  expect this!!!!
          expect(err).toBe('some properties are missing');
          done();
        }
      );
    }
  );

});
