import { TestBed, inject } from '@angular/core/testing';
import { CommunityGroupService } from './community-group-resource.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionStorageService } from '../utils/session-storage.service';

const dummySearchResults = [
  {
    attributes: [],
    auditInfo: {},
    cohortLeaders: [],
    cohortMembers: [],
    cohortProgram: null,
    cohortType: {},
    cohortVisits: [],
    description: '',
    name: 'Test Group',
    location: {},
    startDate: '2018-09-21T00:00:00.000+0300',
    uuid: '9e6fa970-78bb-496d-9e02-14335af1cf90',
    voided: false,
    voidedReason: null
  }
];

describe('CommunityGroupService', () => {
  let communityGroupService: CommunityGroupService;
  let httpMock: HttpTestingController;
  let url: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommunityGroupService,
        AppSettingsService,
        LocalStorageService,
        SessionStorageService
      ],
      imports: [HttpClientTestingModule]
    });

    communityGroupService = TestBed.get(CommunityGroupService);
    httpMock = TestBed.get(HttpTestingController);
    url = communityGroupService.getOpenMrsBaseUrl() + '/cohort';
  });
  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', () => {
    expect(communityGroupService).toBeTruthy();
  });

  it('it should have getOpenMrsBaseUrl() method defines', () => {
    expect(communityGroupService.getOpenMrsBaseUrl()).toBeTruthy();
  });

  it('it should have getCohortVisitUrl() method', () => {
    expect(communityGroupService.getCohortVisitUrl()).toBeTruthy();
  });

  it('should get group given group name', () => {
    const gName = 'testgroup';
    const response = {
      name: 'test group',
      attributes: [{ attributeType: 'groupNumber', value: 'DC-13423-12783' }],
      cohortType: 'community_group',
      location: '6eedfdda-277deedf-21eedfac-ee3fd22sdf'
    };
    communityGroupService.getGroupByName(gName).subscribe();
    const req = httpMock.expectOne(
      url + '?v=full&q=' + gName + '&cohortType=community_group'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('?v=full');
    expect(req.request.urlWithParams).toContain('&q=' + gName);
    req.flush(response);
  });

  it('should get group given group uuid', () => {
    const gUuid = 'testgroupuuid';
    const response = {
      name: 'test group',
      attributes: [{ attributeType: 'groupNumber', value: 'DC-13423-12783' }],
      cohortType: 'community_group',
      location: '6eedfdda-277deedf-21eedfac-ee3fd22sdf'
    };
    communityGroupService.getGroupByUuid(gUuid).subscribe((res) => {
      expect(res).toEqual(response);
    });
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() +
        '/cohort' +
        `/${gUuid}` +
        `?v=full`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toContain(gUuid);
    req.flush(response);
  });

  it('should get cohort types', () => {
    const gUuid = 'testgroupuuid';
    const cohortTypes = ['cohort A', 'cohort ', 'cohort C', 'cohort D'];
    communityGroupService.getCohortTypes().subscribe();
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() + '/cohorttype' + '?v=full'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('?v=full');
    req.flush(cohortTypes);
  });

  it('should get cohort programs', () => {
    const cohortProgram = ['program A', 'program ', 'program C', 'program D'];
    communityGroupService.getCohortPrograms().subscribe();
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() + '/cohortprogram'
    );
    expect(req.request.method).toBe('GET');
    req.flush(cohortProgram);
  });

  it('should return null if create group is null', () => {
    httpMock.expectNone({});
    const result = communityGroupService.createGroup(null);
    expect(result).toBeNull();
  });

  it('should create a group', () => {
    const payload = {
      name: 'test group',
      attributes: [{ attributeType: 'groupNumber', value: 'DC-13423-12783' }],
      cohortType: 'community_group',
      location: '6eedfdda-277deedf-21eedfac-ee3fd22sdf'
    };
    communityGroupService.createGroup(payload).subscribe((res) => {
      expect(res).toEqual(payload);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(payload, { status: 201, statusText: 'Created' });
  });

  it('should disband a group', () => {
    const body = {
      endDate: new Date(),
      voided: true,
      voidReason: 'reason'
    };
    const uuid = 'groupUuid';
    communityGroupService
      .disbandGroup(uuid, new Date(), 'reason')
      .subscribe((res) => {
        expect(res).toEqual('group disbanded successfully');
      });
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() + '/cohort' + ` /${uuid}`
    );
    expect(req.request.method).toBe('POST');
    req.flush('group disbanded successfully');
  });

  it('should return null if update called with no parameters', () => {
    httpMock.expectNone({});
    const result = communityGroupService.updateCohortGroup(null, 'uuid');
    expect(result).toBeNull();
  });

  it('should update cohort group', () => {
    const body = {
      endDate: new Date(),
      voided: true,
      voidReason: 'reason'
    };
    const uuid = 'groupUuid';
    communityGroupService.updateCohortGroup(body, uuid).subscribe((res) => {
      expect(res).toEqual('group updated successfully');
    });
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() + '/cohort/' + uuid
    );
    expect(req.request.method).toBe('POST');
    req.flush('group updated successfully');
  });

  it('should activate group', () => {
    const body = {
      endDate: new Date(),
      voided: true,
      voidReason: 'reason'
    };
    const uuid = 'groupUuid';
    communityGroupService.activateGroup(uuid).subscribe((res) => {
      expect(res).toEqual('group activated successfully');
    });
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() + `/cohort/${uuid}`
    );
    expect(req.request.method).toBe('POST');
    req.flush('group activated successfully');
  });

  it('should start group visit', () => {
    const body = {
      endDate: new Date(),
      voided: true,
      voidReason: 'reason'
    };
    const uuid = 'groupUuid';
    communityGroupService.startGroupVisit(body).subscribe((res) => {
      expect(res).toEqual('group visit started successfully');
    });
    const req = httpMock.expectOne(communityGroupService.getCohortVisitUrl());
    expect(req.request.method).toBe('POST');
    req.flush('group visit started successfully');
  });

  it('should start individual visit', () => {
    const body = {
      endDate: new Date(),
      voided: true,
      voidReason: 'reason'
    };
    const uuid = 'groupUuid';
    communityGroupService.startIndividualVisit(body).subscribe((res) => {
      expect(res).toEqual('individual visit started successfully');
    });
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() + `/cohortmembervisit`
    );
    expect(req.request.method).toBe('POST');
    req.flush('individual visit started successfully');
  });

  it('should get groups by location uuid', () => {
    const loc_uuid = 'uuid';
    const groups = ['cohort A', 'cohort ', 'cohort C', 'cohort D'];
    communityGroupService.getGroupsByLocationUuid(loc_uuid).subscribe();
    const req = httpMock.expectOne(
      communityGroupService.getOpenMrsBaseUrl() +
        '/cohort' +
        '?location=' +
        loc_uuid +
        '&v=full'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('&v=full');
    req.flush(groups);
  });

  it('should generate group number', () => {
    const loc_uuid = 'uuid';
    const groupnumber = 90;
    communityGroupService.generateGroupNumber(loc_uuid).subscribe();
    const req = httpMock.expectOne(
      `https://ngx.ampath.or.ke/group-idgen/generategroupnumber/${loc_uuid}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(groupnumber);
  });
});
