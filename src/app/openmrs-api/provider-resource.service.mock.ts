import { Observable, Subject, BehaviorSubject } from "rxjs";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { ProviderResourceService } from "./provider-resource.service";
import { PersonResourceService } from "./person-resource.service";
import { HttpClient } from "@angular/common/http";
/**
 * FakeProgramEnrollmentResourceService
 */
export class FakeProviderResourceService {
  public returnErrorOnNext = false;

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    protected personService: PersonResourceService
  ) {}

  public getProviderByUuid(uuid: string): Observable<any> {
    const subject = new BehaviorSubject<any>(null);
    subject.next([
      {
        uuid: "uuid1",
        display: "display",
      },
      {
        uuid: "uuid2",
        display: "display",
      },
    ]);
    return subject;
  }
  public getProviderByPersonUuid(uuid: string): Observable<any> {
    const subject = new BehaviorSubject<any>(null);
    subject.next([
      {
        person: {
          uuid: "uuid",
          display: "display",
        },
      },
      {
        person: {
          uuid: "uuid",
          display: "display",
        },
      },
    ]);
    return subject;
  }
  public searchProvider(
    searchText: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    const test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    const provider = [
      {
        uuid: "uuid",
        display: "john",
        person: {
          uuid: "uuid",
          display: "display",
        },
      },
      {
        uuid: "uuid1",
        display: "kennedy",
        person: {
          uuid: "uuid",
          display: "display",
        },
      },
    ];

    if (!this.returnErrorOnNext) {
      test.next(provider);
    } else {
      test.error(new Error("Error loading provider"));
    }
    return test.asObservable();
  }
}
