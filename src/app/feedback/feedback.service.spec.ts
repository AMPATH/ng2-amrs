import { inject, TestBed } from '@angular/core/testing';
import { FeedBackService } from './feedback.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserDefaultPropertiesService } from '../user-default-properties';
import { UserService } from '../openmrs-api/user.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

class UserServiceStub {
  person = {
    display: 'test person'
  };

  getLoggedInUser() {
    return {
      person: this.person
    };
  }
}

describe('FeedBackService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FeedBackService,
        UserService,
        AppSettingsService,
        UserDefaultPropertiesService,
        LocalStorageService,
        HttpClient,
        { provide: UserService, useClass: UserServiceStub }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });


  it('should be defined',
    inject([FeedBackService], (feedbackService: FeedBackService) => {
      expect(feedbackService).toBeDefined();
    })
  );
  it('should call the right url when postFeedback is called',
    inject([FeedBackService, AppSettingsService, HttpTestingController],
      (feedbackService, appSettingsService, httpMock) => {
        const samplePayload = { phone: '070000000', message: 'message' };
        feedbackService.postFeedback(samplePayload).subscribe((response) => {
          expect(response).toBe([{ status: 'okay' }]);
        });
        const url = appSettingsService.getEtlServer() + '/user-feedback';
        const request = httpMock.expectOne(url);
        expect(request.request.url).toBe(url);
        httpMock.verify();

      }));
});
