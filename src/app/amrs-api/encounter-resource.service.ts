import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class EncounterResourceService {

    constructor() { }
    getEncountersByUuid(uuid: string,cached: boolean=false,v: string = null): Observable<any> {
        let test: Subject<any> = new Subject<any>();
        return test.asObservable();
    }
}