/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync } from '@angular/core/testing';
import {
  VisitResourceService
} from '../../../openmrs-api/visit-resource.service';
import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { FakeVisitResourceService } from '../../../openmrs-api/fake-visit-resource.service';
import { Patient } from '../../../models/patient.model';
import { VitalsDatasource } from './vitals.datasource';
describe('Datasource: VitalsDatasource', () => {
  let source: VitalsDatasource;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VitalsDatasource
      ]
    });
    source = TestBed.get(VitalsDatasource);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(source).toBeTruthy();
  });

  it('should get todays vitals based on todays triage encounters', () => {
    const mockPatient = new Patient({
      'patient': {
        'person': { uuid: 'bad1e162-cd75-45c6-97f8-13a6a4d6ce01', age: 9, birthdate: '2009-01-10' },
      }
    });
  });

});
