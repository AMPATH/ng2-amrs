import { Injectable } from '@angular/core';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Provider } from '../../models/provider.model';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';

@Injectable()

export class FormDataSourceService {

  constructor(private providerResourceService: ProviderResourceService,
    private locationResourceService: LocationResourceService) { }


  getDataSources() {
    let formData: any = {
      location: {
        resolveSelectedValue: this.getLocationByUuid,
        searchOption: this.findLocation
      },
      provider: {
        resolveSelectedValue: this.getProviderByPersonUuid,
        searchOption: this.findProvider
      }
    };
    return formData;
  }


   findProvider(searchText): Observable<Provider[]> {
    let providerSearchResults: BehaviorSubject<Provider[]> = new BehaviorSubject<Provider[]>([]);
    let findProvider = this.providerResourceService.searchProvider(searchText, false);
    findProvider.subscribe(
      (provider) => {
        let selectedOptions = [];
        for (let i = 0; i < provider.length; i++) {
          selectedOptions.push({
            label: provider[i].display || provider[i].person.display,
            value: provider[i].person.uuid
          });
        }
        providerSearchResults.next(selectedOptions);
      },
      (error) => {
        providerSearchResults.error(error); // test case that returns error
      }
    );
    return providerSearchResults.asObservable();
  }

  getProviderByUuid(uuid): Observable<any> {
    let providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
     this.providerResourceService.getProviderByUuid(uuid, false)
       .subscribe(
      (provider) => {
        let mappedProvider = {
          label: provider.display,
          value: provider.uuid
        };
        providerSearchResults.next(mappedProvider);

      },
      (error) => {
        providerSearchResults.error(error); // test case that returns error
      }

    );
    return providerSearchResults.asObservable();

  }
  getProviderByPersonUuid(uuid) {
    let providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.providerResourceService.getProviderByPersonUuid(uuid)
      .subscribe(
        (provider) => {
          let mappedProvider = {
            label: (provider as any).person.display,
            value: (provider as any).person.uuid
          };
          providerSearchResults.next(mappedProvider);
        },
        (error) => {
          providerSearchResults.error(error); // test case that returns error
        }

      );
    return providerSearchResults.asObservable();
  }


  getPatientObject(patient: Patient): Object {
    let model: Object;
    let gender = patient.person.gender;
    let age = patient.person.age;
    model['sex'] = gender;
    model['age'] = age;

    // define gender based constant:
    if (gender === 'F') model['gendercreatconstant'] = 0.85;
    if (gender === 'M') model['gendercreatconstant'] = 1;

    return model;
  }

  findLocation(searchText): Observable<Location[]> {
    let locationSearchResults: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);
    let findLocation = this.locationResourceService.searchLocation(searchText, false);
    findLocation.subscribe(
      (location) => {
        let selectedOptions = [];
        for (let i = 0; i < location.length; i++) {
          selectedOptions.push({
            label: location[i].display,
            value: location[i].uuid
          });
        }
        locationSearchResults.next(selectedOptions);
      },
      (error) => {
        locationSearchResults.error(error);
      }
    );
    return locationSearchResults.asObservable();
  }

  getLocationByUuid(uuid): Observable<any> {
    let locationSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.locationResourceService.getLocationByUuid(uuid, false)
      .subscribe(
      (location) => {
        let mappedLocation = {
          label: location.display,
          value: location.uuid
        };
        locationSearchResults.next(mappedLocation);
      },
      (error) => {
        locationSearchResults.error(error);
      }
      );
    return locationSearchResults.asObservable();
  }

}
