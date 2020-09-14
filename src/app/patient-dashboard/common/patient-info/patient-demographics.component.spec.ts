import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { PatientService } from '../../services/patient.service';
import { PatientDemographicsComponent } from './patient-demograpics.component';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { StringToDatePipe } from '../../../shared/pipes/string-to-date.pipe';
import { PatientCreationService } from 'src/app/patient-creation/patient-creation.service';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
  transform(value: any, decimalPlaces: number): any {
    return value;
  }
}
describe('Component: Patient Demographics Unit Tests', () => {
  const fakePatientService = {
    currentlyLoadedPatient: of({
      uuid: '',
      person: {
        uuid: 'person_uuid',
        display: 'name',
        age: 20,
        dead: false,
        birthdate: '2016-11-22',
        levelOfEducation: { value: 'f464e9e5-e1fe-449e-92d7-b8c66150b73d' }
      }
    })
  };

  const fakeChangeDetectorRef = {
    markForCheck: () => {}
  };

  const fakePatientCreationService = {
    getLevelOfEducation: () =>
      of({
        answers: [
          {
            name: {
              uuid: 'f464e9e5-e1fe-449e-92d7-b8c66150b73d',
              display: 'PRE UNIT'
            }
          }
        ]
      })
  };

  let fixture, comp, nativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        PatientDemographicsComponent,
        FakeTranslatePipe,
        StringToDatePipe
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
        {
          provide: PatientService,
          useValue: fakePatientService
        },
        {
          provide: PatientCreationService,
          useValue: fakePatientCreationService
        },
        PatientDemographicsComponent,
        [
          {
            provide: AppFeatureAnalytics,
            useFactory: () => {
              return new FakeAppFeatureAnalytics();
            },
            deps: []
          }
        ]
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PatientDemographicsComponent);
        comp = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const fakeAppFeatureAnalytics: AppFeatureAnalytics = TestBed.get(
      AppFeatureAnalytics
    );
    const patientCreationService: PatientCreationService = TestBed.get(
      PatientCreationService
    );
    const component = new PatientDemographicsComponent(
      null,
      fakeAppFeatureAnalytics,
      null
    );
    expect(component).toBeTruthy();
  });
  it('should render demographics correctly', inject([PatientService], () => {
    comp.ngOnInit();
    fixture.detectChanges();
    const tr = nativeElement.querySelectorAll('tr');
    const length: number = tr.length;
    expect(tr[1].innerHTML).toContain('Name');
    expect(length).toBeGreaterThan(0);
  }));
});
