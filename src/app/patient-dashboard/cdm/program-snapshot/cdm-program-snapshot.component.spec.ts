import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { Observable } from 'rxjs';
import { CdmProgramSnapshotComponent } from './cdm-program-snapshot.component';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

const summaryResult = {
  'encounter_datetime': '2017-04-25T07:54:20.000Z',
  'location_uuid': '123',
  'rtc_date': '2017-05-22T21:00:00.000Z',
  'is_clinical_encounter': 1,
  'sbp': 108,
  'dbp': 69,
  'rbs': 7,
  'hb_a1c': 'value',
  'hb_a1c_date': '2017-04-25T07:54:20.000Z',
  'dm_status': 'value',
  'htn_status': 'value',
  'dm_meds': 'value',
  'htn_med': 'value',
};

class FakeCdmSummaryResourceService {
  constructor() {
  }
}

class FakeAppSettingsService {
  constructor() {
  }

  public getOpenmrsServer() {
    return 'openmrs-url';
  }
}
describe('Component: CdmProgramSnapshotComponent', () => {
  let hivService: CdmSummaryResourceService, component, fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ZeroVlPipe,
        {
          provide: CdmSummaryResourceService,
          useClass: FakeCdmSummaryResourceService
        },
        {
          provide: AppSettingsService,
          useClass: FakeAppSettingsService
        }
      ],
      declarations: [CdmProgramSnapshotComponent, ZeroVlPipe],
      imports: []
    }).compileComponents().then(() => {
      hivService = TestBed.get(CdmSummaryResourceService);
      fixture = TestBed.createComponent(CdmProgramSnapshotComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create an instance', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.hasError).toEqual(false);
    expect(component.hasData).toEqual(false);
    expect(component.patientData).toEqual({});
    done();
  });
});
