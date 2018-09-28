import { TestBed, async, inject } from '@angular/core/testing';
import { CommunityGroupService } from './community-group-resource.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';

fdescribe('CommunityGroupService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CommunityGroupService,
                MockBackend,
                BaseRequestOptions,
                {
                  provide: Http,
                  useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backendInstance, defaultOptions);
                  },
                  deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                CommunityGroupAttributeService
            ]
        });
    });
    afterEach(() => {
        TestBed.resetTestingModule();
      });

      it('should be injected with all dependencies',
        inject([CommunityGroupService],
          (communityGroupService: CommunityGroupService) => {
            expect(communityGroupService).toBeTruthy();
          }));


});
