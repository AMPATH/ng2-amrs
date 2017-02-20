import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { FakeUserFactory } from '../formentry/mock/user-factory.service.mock';
import {
  FakeDefaultUserPropertiesFactory
} from '../formentry/mock/default-user-properties-factory.service.mock';
import { PatientService } from '../patient.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import {
  UserDefaultPropertiesService
} from
  '../../user-default-properties/user-default-properties.service';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { Patient } from '../../models/patient.model';
import { HivPatientClinicalSummaryComponent } from './hiv-patient-clinical-summary.component';
import {
  HivPatientClinicalSummaryResourceService
} from '../../etl-api/hiv-patient-clinical-summary-resource.service';
import { HivPatientClinicalSummaryService } from './hiv-patient-clinical-summary.service';

describe('Component: HivPatientClinicalSummaryComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        HivPatientClinicalSummaryComponent,
        HivPatientClinicalSummaryService,
        AppSettingsService,
        LocalStorageService,
        PersonResourceService,
        PatientService,
        HivPatientClinicalSummaryResourceService,
        PatientResourceService,
        ProgramEnrollmentResourceService,
        {
          provide: PatientService, useFactory: () => {
          return new PatientServiceMock();
        }, deps: []
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
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
    let patientClinicalSummaryComponent: HivPatientClinicalSummaryComponent
      = TestBed.get(HivPatientClinicalSummaryComponent);
    expect(patientClinicalSummaryComponent).toBeTruthy();
  });

  it('should have all required properties declared and initialized as public property / method',
    () => {
      let component: HivPatientClinicalSummaryComponent
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
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      let hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      let patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.next(
          {
            patientUuid: uuid,
            notes: [],
            vitals: [],
            hivSummaries: [],
            reminders: [],
            labDataSummary: []
          }
        );
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.ngOnInit();
      expect(hivPatientClinicalSummaryService.generatePdf).toHaveBeenCalled();
      done();
    }
  );

  it('should fetch patient summaries from server when the component initializes',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      let hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      let patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.next(
          {
            patientUuid: uuid,
            notes: [],
            vitals: [],
            hivSummaries: [],
            reminders: [],
            labDataSummary: []
          }
        );
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.ngOnInit();
      expect(patientClinicalSummaryResource.fetchPatientSummary)
        .toHaveBeenCalledWith('patient-uuid');
      done();
    }
  );
  it('should generate pdf when the component generatePdf() is invoked',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      let hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      let patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.next(
          {
            patientUuid: uuid,
            notes: [],
            vitals: [],
            hivSummaries: [],
            reminders: [],
            labDataSummary: []
          }
        );
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.generatePdf();

      expect(hivPatientClinicalSummaryService.generatePdf).toHaveBeenCalled();
      done();
    }
  );

  it('should fetch patient summaries from server when the generatePdf() is invoked',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      let hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      let patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.next(
          {
            patientUuid: uuid,
            notes: [],
            vitals: [],
            hivSummaries: [],
            reminders: [],
            labDataSummary: []
          }
        );
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.generatePdf();
      expect(patientClinicalSummaryResource.fetchPatientSummary)
        .toHaveBeenCalledWith('patient-uuid');
      done();
    }
  );

  it('should throw an error when generatePdf fails',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      let hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      let patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.next(
          {
            patientUuid: uuid,
            notes: [],
            vitals: [],
            hivSummaries: [],
            reminders: [],
            labDataSummary: []
          }
        );
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.error('throwing an error intentionally');
        return subject;
      });

      component.generatePdf();
      expect(patientClinicalSummaryResource.fetchPatientSummary)
        .toHaveBeenCalledWith('patient-uuid');
      expect(component.errorFlag).toBe(true);
      done();
    }
  );

  it('should throw an error when fetchPatientSummary encounters an error',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);
      let hivPatientClinicalSummaryService: HivPatientClinicalSummaryService
        = TestBed.get(HivPatientClinicalSummaryService);
      let patientClinicalSummaryResource: HivPatientClinicalSummaryResourceService
        = TestBed.get(HivPatientClinicalSummaryResourceService);

      spyOn(patientClinicalSummaryResource, 'fetchPatientSummary').and.callFake((uuid) => {
        let subject = new BehaviorSubject<any>({});
        subject.error('throwing an error intentionally');
        return subject;
      });
      spyOn(hivPatientClinicalSummaryService, 'generatePdf').and.callThrough();

      component.generatePdf();
      expect(patientClinicalSummaryResource.fetchPatientSummary)
        .toHaveBeenCalledWith('patient-uuid');
      expect(component.errorFlag).toBe(true);
      done();
    }
  );

  it('should navigate to the next page when nextPage is invoked',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);

      component.ngOnInit();
      component.nextPage(); // navigate
      expect(component.page).toBe(2);
      done();
    }
  );

  it('should navigate to the previous page when prevPage() is invoked',
    (done) => {
      let component: HivPatientClinicalSummaryComponent
        = TestBed.get(HivPatientClinicalSummaryComponent);

      component.ngOnInit();
      component.prevPage(); // navigate
      expect(component.page).toBe(0);
      done();
    }
  );
});


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
