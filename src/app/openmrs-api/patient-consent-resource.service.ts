import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import * as _ from "lodash";

import { ObsResourceService } from "./obs-resource.service";

@Injectable()
export class PatientConsentResourceService {
  constructor(private obsResourceService: ObsResourceService) {}

  public getPatientCallConsent(patientUuid): Observable<any> {
    const consentObservable = new Observable((observer) => {
      const clientConsent = {
        hasCallConsent: false,
      };
      // check if patient has ever answered consent question
      const callConsentConceptUuid = ["9d9ccb6b-73ae-48dd-83f9-12c782ce6685"];
      this.obsResourceService
        .getObsPatientObsByConcepts(patientUuid, callConsentConceptUuid)
        .subscribe((data) => {
          const results = data["results"];
          if (results.length > 0) {
            clientConsent.hasCallConsent = true;

            return observer.next(clientConsent);
          } else {
            return observer.next(clientConsent);
          }
        });
    });

    return consentObservable;
  }
}
