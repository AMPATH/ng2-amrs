import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs/RX';

@Injectable()
export class LocationService {

    private locationSubject: Subject<any> = new Subject();

    public setCurrentLocation(newLocation: any): void {
        
        this.locationSubject.next(newLocation.label);
        console.log(newLocation.label);
    }

    public getCurrentLocation(): Observable<any> {
        return this.locationSubject.asObservable();
  }
}
