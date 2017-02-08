import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ProviderResourceService } from './provider-resource.service';
import { PersonResourceService } from './person-resource.service';
/**
 * FakeProgramEnrollmentResourceService
 */
export class FakeProviderResourceService {
  returnErrorOnNext: boolean = false;

  constructor(protected http: Http, protected appSettingsService: AppSettingsService,
    protected personService: PersonResourceService) {
  }

  public getProviderByUuid(uuid: string): Observable<any> {
    let subject = new BehaviorSubject<any>(null);
    subject.next(
      [
        {
          uuid: 'uuid1',
          display: 'display'
        },
        {
          uuid: 'uuid2',
          display: 'display'
        }
      ]
    );
    return subject;
  }
  public getProviderByPersonUuid(uuid: string): Observable<any> {
    let subject = new BehaviorSubject<any>(null);
    subject.next(
      [
        {
          person: {
            uuid: 'uuid',
            display: 'display'
          }
        },
        {
          person: {
            uuid: 'uuid',
            display: 'display'
          }
        }
      ]
    );
    return subject;
  }
  searchProvider(searchText: string,
    cached: boolean = false, v: string = null): Observable<any> {
    let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let provider = [
      {
        uuid: 'uuid',
        display: 'john',
        person: {
          uuid: 'uuid',
          display: 'display'
        }
      },
      {
        uuid: 'uuid1',
        display: 'kennedy',
        person: {
          uuid: 'uuid',
          display: 'display'
        }
      }
    ];


    if (!this.returnErrorOnNext) {
      test.next(provider);
    } else {
      test.error(new Error('Error loading provider'));
    }
    return test.asObservable();
  };
}
