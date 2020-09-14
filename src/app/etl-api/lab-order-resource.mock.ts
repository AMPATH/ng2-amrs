import { BehaviorSubject, Observable } from 'rxjs';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';

/**
 * FakeLabOrderResourceService
 */
export class FakeLabOrderResourceService {
  public returnErrorOnNext = false;
  constructor() {}
  public postOrderToEid(location, payload: any): Observable<any> {
    const test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    const data = {
      result: {
        type: 'VL',
        locationUuid: 'xxxxxx',
        orderNumber: 'ORD-1',
        providerIdentifier: 'bbbb',
        patientName: 'TEST PATIENT',
        patientIdentifier: 'yyyyyyy',
        sex: 'F',
        birthDate: '1990-01-01',
        artStartDateInitial: '2012-01-01',
        artStartDateCurrent: '2012-01-01',
        sampleType: 1,
        artRegimenUuid: '6964',
        vlJustificationUuid: 'xxxxx',
        dateDrawn: '2017-01-01',
        dateReceived: '2017-01-05'
      }
    };

    if (!this.returnErrorOnNext) {
      test.next(data);
    } else {
      test.error(new Error('Error loading patient'));
    }
    return test.asObservable();
  }
}
