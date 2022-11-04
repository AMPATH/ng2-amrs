import { FormsModule } from '@angular/forms';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaseManagementFiltersComponent } from './case-management-filters.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CaseManagementResourceService } from './../../etl-api/case-management-resource.service';

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  public params = of([{ id: 1 }]);
  public snapshot = {
    queryParams: { date: '' }
  };
}

const mockCaseManagersResponse = [
  {
    location_uuid: 'locationUuid',
    number_assigned: 2,
    person_name: 'Test Manager',
    provider_id: 2,
    user_id: 1,
    user_uuid: 'uuid'
  }
];
const mockCaseManagers = [
  {
    person_name: 'Test Manager 1',
    user_id: 1
  },
  {
    person_name: 'Test Manager 2',
    user_id: 2
  }
];

const mockParams = {
  caseManagerUserId: [1, 2],
  dueForVl: 'true',
  elevatedVL: 'true',
  hasCaseManager: 'true',
  hasPhoneRTC: 'true',
  isNewlyEnrolled: 'true',
  minDefaultPeriod: '1',
  maxDefaultPeriod: '100',
  maxFollowupPeriod: '100',
  minFollowupPeriod: '1',
  rtcStartDate: '2020-05-01',
  rtcEndDate: '2020-05-30',
  phoneFollowUpStartDate: '2020-05-01',
  filterSet: true,
  locationUuid: 'locationUuid'
};

const caseManagementService = jasmine.createSpyObj(
  'CaseManagementResourceService',
  ['getCaseManagers']
);

const caseManagementResourceServiceSpy =
  caseManagementService.getCaseManagers.and.returnValue(
    of(mockCaseManagersResponse)
  );

describe('Component: Case Management Filter', () => {
  let fixture: ComponentFixture<CaseManagementFiltersComponent>;
  let comp: CaseManagementFiltersComponent;
  let route: ActivatedRoute;
  let router: Router;
  let caseManagementResourceService: CaseManagementResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgamrsSharedModule, DateTimePickerModule],
      declarations: [CaseManagementFiltersComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: CaseManagementResourceService,
          useValue: caseManagementResourceServiceSpy
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CaseManagementFiltersComponent);
        comp = fixture.componentInstance;
        caseManagementResourceService =
          fixture.debugElement.injector.get<CaseManagementResourceService>(
            CaseManagementResourceService
          );
        router = fixture.debugElement.injector.get(Router);
        route = fixture.debugElement.injector.get(ActivatedRoute);
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(comp).toBeDefined();
  });

  it('should return correct location params', () => {
    comp.clinicDashboardLocation = 'locationuuid';
    const mockLocationParams = {
      locationUuid: comp.clinicDashboardLocation
    };
    expect(JSON.stringify(comp.getLocationParams())).toBe(
      JSON.stringify(mockLocationParams)
    );
  });

  it('should create correct manager dropdown options from manager list', () => {
    comp.processCaseManagers(mockCaseManagers);
    const expectedManagerOptions = [
      {
        label: 'Test Manager 1',
        value: 1
      },
      {
        label: 'Test Manager 2',
        value: 2
      }
    ];
    expect(JSON.stringify(comp.caseManagers)).toBe(
      JSON.stringify(expectedManagerOptions)
    );
  });

  it('should set the correct params object from local variables', () => {
    comp.dueForVl = 'true';
    comp.hasCaseManager = 'true';
    comp.hasPhoneRTC = 'true';
    comp.isNewlyEnrolled = 'true';
    comp.elevatedVL = 'true';
    comp.minFollowupPeriod = '1';
    comp.maxFollowupPeriod = '100';
    comp.minDefaultPeriod = '1';
    comp.maxDefaultPeriod = '100';
    comp.selectedCaseManager = [
      {
        label: 'Test Manager 1',
        value: 1
      },
      {
        label: 'Test Manager 2',
        value: 2
      }
    ];
    comp.rtcStartDate = '2020-05-01';
    comp.selectedRtcStartDate = '2020-05-01';
    comp.rtcEndDate = '2020-05-30';
    comp.selectedRtcEndDate = '2020-05-30';
    comp.phoneFollowUpStartDate = '2020-05-01';
    comp.selectedPhoneFollowUpDate = '2020-05-01';
    comp.filterSet = true;
    comp.hideCaseManagerControl = false;
    comp.clinicDashboardLocation = 'locationUuid';
    spyOn(comp, 'storeReportParamsInUrl');
    comp.setParams();
    expect(JSON.stringify(comp.params)).toBe(JSON.stringify(mockParams));
    expect(comp.storeReportParamsInUrl).toHaveBeenCalled();
  });

  it('should hide case manager list on selecting no case manager option', () => {
    spyOn(comp, 'toggleCaseManagerControl').and.callThrough();
    comp.onHasCaseManagerChange('false');
    expect(comp.toggleCaseManagerControl).toHaveBeenCalled();
    expect(comp.hideCaseManagerControl).toBe(true);
    expect(comp.selectedCaseManager).toBe('');
  });

  it('Assign correct dueforVl on value change', () => {
    comp.onDueForVlChange('true');
    expect(comp.dueForVl).toBe('true');
  });

  it('Assign correct elevatedVl on value change', () => {
    comp.onElevatedVLChange('true');
    expect(comp.elevatedVL).toBe('true');
  });

  it('Assign correct case manager on manager change', () => {
    const selectedManager = [
      {
        label: 'Test Manager 1',
        value: 1
      }
    ];
    comp.onCaseManagerSelected(selectedManager);
    expect(JSON.stringify(comp.selectedCaseManager)).toBe(
      JSON.stringify(selectedManager)
    );
  });

  it('Assign correct selected RTC Start date on change', () => {
    const selectedRTCStartDate = '2020-05-21T14:46:19+03:00';
    const expectedRTCStartDate = '2020-05-21';
    comp.getSelectedRtcStartDate(selectedRTCStartDate);
    expect(comp.rtcStartDate).toBe(selectedRTCStartDate);
    expect(comp.selectedRtcStartDate).toBe(expectedRTCStartDate);
  });

  it('Assign correct selected RTC End date on rtc change', () => {
    const selectedRTCSEndDate = '2020-05-20T14:46:19+03:00';
    const expectedRTCSEndDate = '2020-05-20';
    comp.getSelectedRtcEndDate(selectedRTCSEndDate);
    expect(comp.rtcEndDate).toBe(selectedRTCSEndDate);
    expect(comp.selectedRtcEndDate).toBe(expectedRTCSEndDate);
  });

  it('Assign correct selected phone follow up date on  change', () => {
    const selectedPhoneFollowUpStartDate = '2020-05-20T14:46:19+03:00';
    const expectedPhoneFollowUpStartDate = '2020-05-20';
    comp.getSelectedPhoneFollowUpStartDate(selectedPhoneFollowUpStartDate);
    expect(comp.phoneFollowUpStartDate).toBe(selectedPhoneFollowUpStartDate);
    expect(comp.selectedPhoneFollowUpDate).toBe(expectedPhoneFollowUpStartDate);
  });

  it('Reset Filter to clear all variables', () => {
    spyOn(comp.filterReset, 'emit');
    spyOn(comp, 'setParams').and.callFake(() => {
      return true;
    });
    comp.resetFilters();
    expect(comp.dueForVl).toBe('');
    expect(comp.hasCaseManager).toBe('');
    expect(comp.hasPhoneRTC).toBe('');
    expect(comp.isNewlyEnrolled).toBe('');
    expect(comp.elevatedVL).toBe('');
    expect(comp.minFollowupPeriod).toBe('');
    expect(comp.maxFollowupPeriod).toBe('');
    expect(comp.minDefaultPeriod).toBe('');
    expect(comp.maxDefaultPeriod).toBe('');
    expect(comp.selectedCaseManager).toBe('');
    expect(comp.rtcStartDate).toBe('');
    expect(comp.selectedRtcStartDate).toBe('');
    expect(comp.rtcEndDate).toBe('');
    expect(comp.selectedRtcEndDate).toBe('');
    expect(comp.phoneFollowUpStartDate).toBe('');
    expect(comp.selectedPhoneFollowUpDate).toBe('');
    expect(comp.filterSet).toEqual(false);
    expect(comp.hideCaseManagerControl).toBe(false);
    expect(comp.selectedCaseManager).toEqual('');
    expect(comp.filterReset.emit).toHaveBeenCalledWith(true);
    expect(comp.setParams).toHaveBeenCalled();
  });
});
