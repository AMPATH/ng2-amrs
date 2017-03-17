import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class LocationService {

    locationSubject: Subject<any> = new Subject();

    public setCurrentLocation(newLocation: any): void {
        
        this.locationSubject.next(newLocation);
        console.log('hello');
    }
}
