
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';

import { LabsResourceService } from '../../../etl-api/labs-resource.service';
import { PatientService } from '../../services/patient.service';
import { LabResultComponent } from './lab-result.component';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
  transform(value: any, decimalPlaces: number): any {
    return value;
  }
}
describe('Component: Lab Results Unit Tests', () => {
  let fakePatientService = {
    currentlyLoadedPatient: Observable.of({ uuid: '', person: { uuid: 'person_uuid' } })
};
  let fakeLabsServiceName = {
    getHistoricalPatientLabResults: (args) => {
      return Observable.of(
        [
          {
            ast: null,
            cd4_count: null,
            cd4_error: null,
            cd4_percent: null,
            chest_xray: '',
            creatinine: null,
            cur_arv_meds: 'LOPINAVIR AND RITONAVIR, LAMIVUDINE AND TENOFOVIR',
            encounter_id: 331431526,
            encounter_type: 99999,
            has_errors: null,
            hemoglobin: null,
            hiv_dna_pcr: '',
            hiv_dna_pcr_error: null,
            hiv_rapid_test: null,
            hiv_viral_load: 13730,
            lab_errors: '',
            person_id: 66118,
            test_datetime: '2016-06-21T21:00:00.000Z',
            tests_ordered: 'Viral,',
            uuid: '5d00337c-1359-11df-a1f1-0026b934883888888',
            vl_error: null
          }
        ]);
    }
  };

  let fakeChangeDetectorRef = {
    markForCheck: () => { }
  };

  let fixture, comp, nativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        LabResultComponent,
        FakeTranslatePipe
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
        { provide: LabsResourceService, useValue: fakeLabsServiceName },
        {
          provide: PatientService, useValue: fakePatientService
        },
        LabResultComponent,
        ZeroVlPipe
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LabResultComponent);
        comp = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
      });
  }));

  it('should be defined', inject([LabsResourceService],
    (service: LabsResourceService) => {
      expect(comp).toBeTruthy();
    }));
  /*it('should render result table when there are new results',
    inject([LabsResourceService, PatientService],
      (service: LabsResourceService) => {
        comp.ngOnInit();
        fixture.detectChanges();
        let table = nativeElement.querySelectorAll('table');
        expect(table.length).toBe(1);
        let trs = nativeElement.querySelectorAll('tr');
        expect(trs.length).toBe(3);
      }));*/
});
