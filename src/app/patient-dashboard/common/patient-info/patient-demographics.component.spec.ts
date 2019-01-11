
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
        uuid: 'person_uuid', display: 'name', age: 20,
        dead: false, birthdate: '2016-11-22'
      },
    })
};

  const fakeChangeDetectorRef = {
    markForCheck: () => { }
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
          provide: PatientService, useValue: fakePatientService
        },
        PatientDemographicsComponent,
        [
          {
            provide: AppFeatureAnalytics, useFactory: () => {
              return new FakeAppFeatureAnalytics();
            }, deps: []
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
    const fakeAppFeatureAnalytics: AppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    const component = new PatientDemographicsComponent(null, fakeAppFeatureAnalytics);
    expect(component).toBeTruthy();
  });
  it('should render demographics correctly',
    inject([PatientService],
      () => {
        comp.ngOnInit();
        fixture.detectChanges();
        const tr = nativeElement.querySelectorAll('tr');
        const length: number = tr.length;
        expect(tr[1].innerHTML).toContain('Name');
        expect(length).toBeGreaterThan(0);
      }));
});
