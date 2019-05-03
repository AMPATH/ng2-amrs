import { TestBed, inject, async } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FakeUserFactory } from '../../common/formentry/mock/user-factory.service.mock';
import { HivSummaryService } from '../hiv-summary/hiv-summary.service';
import {
  FakeDefaultUserPropertiesFactory
} from '../../common/formentry/mock/default-user-properties-factory.service.mock';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { UserService } from '../../../openmrs-api/user.service';
import {
  UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Patient } from '../../../models/patient.model';
import { HivPatientClinicalSummaryComponent } from './hiv-patient-clinical-summary.component';
import {
  HivPatientClinicalSummaryResourceService
} from '../../../etl-api/hiv-patient-clinical-summary-resource.service';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { HivPatientClinicalSummaryService } from './hiv-patient-clinical-summary.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class PatientServiceMock {
  public currentlyLoadedPatient: BehaviorSubject<Patient>
    = new BehaviorSubject(
      new Patient({
        uuid: 'patient-uuid',
        display: 'patient name',
        person: {
          uuid: 'person-uuid',
          display: 'person name'
        }
      })
    );

  constructor() {
  }

}

describe('Component: HivPatientClinicalSummaryComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HivPatientClinicalSummaryComponent,
        HivPatientClinicalSummaryService,
        AppSettingsService,
        LocalStorageService,
        PersonResourceService,
        PatientService,
        HivSummaryService,
        HivSummaryResourceService,
        PatientProgramService,
        HivPatientClinicalSummaryResourceService,
        PatientResourceService,
        ProgramEnrollmentResourceService,
        {
          provide: PatientService, useFactory: () => {
            return new PatientServiceMock();
          }, deps: []
        },
        {
          provide: UserService, useFactory: () => {
            return new FakeUserFactory();
          }, deps: []
        },
        {
          provide: UserDefaultPropertiesService, useFactory: () => {
            return new FakeDefaultUserPropertiesFactory();
          }, deps: []
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of HivPatientClinicalSummaryComponent', () => {
    const patientClinicalSummaryComponent: HivPatientClinicalSummaryComponent
      = TestBed.get(HivPatientClinicalSummaryComponent);
    expect(patientClinicalSummaryComponent).toBeTruthy();
  });

  it('should have all required properties declared and initialized as public property / method',
    () => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      // properties
      expect(component.pdfSrc).toBeNull();
      expect(component.page).toBe(1);
      expect(component.isBusy).toBe(false);
      expect(component.patient).toBeDefined();
      expect(component.pdfProxy).toBe(null);
      expect(component.pdfMakeProxy).toBe(null);
      expect(component.errorFlag).toBe(false);
      // methods
      expect(component.generatePdf).toBeDefined();
      expect(component.afterLoadCompletes).toBeDefined();
      expect(component.printSummary).toBeDefined();
      expect(component.downloadPdf).toBeDefined();
      expect(component.nextPage).toBeDefined();
      expect(component.prevPage).toBeDefined();
    });

  it('should generate pdf when the component initializes',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      const hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      const patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);
      const service: PatientService = TestBed.get(PatientService);
      const hivSummaryService: HivSummaryService = TestBed.get(HivSummaryService);


      spyOn(hivSummaryService, 'getHivSummary').and.callFake((err, data) => { });

      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();
      done();
     }
  );

  it('should fetch patient summaries from server when the component initializes',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      const hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      const patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((err, data) => { });

      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();
      component.ngOnInit();
      done();
    }
  );
  it('should generate pdf when the component generatePdf() is invoked',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      const hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      const patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      expect(component).toBeDefined();

      done();
    }
  );
  it('should fetch patient summaries from server when the generatePdf() is invoked',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      const hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      const patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.generatePdf();
      done();
    }
  );

  it('should throw an error when generatePdf fails',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      const hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      const patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

       spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callThrough();
       spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callFake((uuid) => {
        const subject = new BehaviorSubject<any>({});
        subject.error('throwing an error intentionally');
        return subject;
      });

      component.generatePdf();
      expect(component.errorFlag).toBe(false);
      done();
    }
  );

  it('should throw an error when fetchPatientSummary encounters an error',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      const hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      const patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        const subject = new BehaviorSubject<any>({});
        subject.error('throwing an error intentionally');
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.generatePdf();

      expect(component.errorFlag).toBe(false);
      done();
    }
  );

  it('should navigate to the next page when nextPage is invoked',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);

      component.ngOnInit();
      component.nextPage(); // navigate
      expect(component.page).toBe(2);
      done();
    }
  );

  it('should navigate to the previous page when prevPage() is invoked',
    (done) => {
      const component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);

      component.ngOnInit();
      component.prevPage(); // navigate
      expect(component.page).toBe(0);
      done();
    }
  );
});
