import { TestBed, inject } from '@angular/core/testing';
import { CommunityGroupService } from './community-group-resource.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

const dummySearchResults = [{
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
}];
describe('CommunityGroupService', () => {
    let communityGroupService: CommunityGroupService;
    let httpMock: HttpTestingController;
    const url = communityGroupService.getOpenMrsBaseUrl() + '/cohort';


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CommunityGroupService,
                AppSettingsService
            ],
          imports: [HttpClientTestingModule]
        });
        // inject the service
      communityGroupService = TestBed.get(CommunityGroupService);
      httpMock = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
        TestBed.resetTestingModule();
      });

    it('should be injected with all dependencies', () => {
      expect(communityGroupService).toBeTruthy();
    });

    it('should search the cohort given the group name/number', () => {
      let searchString = 'test search';

      communityGroupService.searchCohort(searchString, false).subscribe(results => {
        expect(results).toBe(dummySearchResults);
      });
      const req1 = httpMock.expectOne(url);
      expect(req1.request.method).toBe('GET');

      searchString = 'DC-12345-12345';
      const reqParams = {'attributes': `"groupNumber":"${searchString}"`, 'v': 'full'};
      communityGroupService.searchCohort(searchString, false).subscribe(results => {
        expect(results).toBe(dummySearchResults);
      });
      const req2 = httpMock.expectOne(url);
      expect(req2.request.method).toBe('GET');
      expect(req2.request.params).toEqual(reqParams);
      req1.flush(dummySearchResults);

    });

    it('should create a group', () => {
      const payload = {
        'name': 'test group',
        'attributes': [{'attributeType': 'groupNumber', 'value': 'DC-13423-12783'}],
        'cohortType': 'community_group',
        'location': '6eedfdda-277deedf-21eedfac-ee3fd22sdf',
      };
      communityGroupService.createGroup(payload).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.headers).toEqual({'Content-Type': 'application/json'});

      req.flush(payload, {status: 201, statusText: 'Created'});
    });



});
