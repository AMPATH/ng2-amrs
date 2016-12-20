import { Injectable } from '@angular/core';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Provider } from '../../models/provider.model';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';

@Injectable()

export class FormDataSourceService {
  public providerSearchResults: BehaviorSubject<Provider[]> = new BehaviorSubject<Provider[]>([]);
  constructor(private providerResourceService: ProviderResourceService) { }


  findProvider(searchText): Observable<Provider[]> {
    let findProvider = this.providerResourceService.searchProvider(searchText, false);
    findProvider.subscribe(
      (provider) => {
        let mappedProvider: Provider[] = new Array<Provider>();

        for (let i = 0; i < provider.length; i++) {
          mappedProvider.push(new Provider(provider[i]));
        }
        this.providerSearchResults.next(mappedProvider);
      },
      (error) => {
        this.providerSearchResults.error(error); // test case that returns error
      }
    );
    return this.providerSearchResults.asObservable();
  }
  getProviderByUuid(uuid): Observable<Provider[]> {
    this.providerResourceService.getProviderByUuid(uuid, false)
      .subscribe(
      (provider) => {
        let mappedProvider: Provider[] = [];
        mappedProvider.push(new Provider(provider));
        this.providerSearchResults.next(mappedProvider);
      },
      (error) => {
        this.providerSearchResults.error(error); // test case that returns error
      }
      );
    return this.providerSearchResults.asObservable();
  }
  getProviderByPersonUuid(uuid) {
    this.providerResourceService.getProviderByPersonUuid(uuid)
      .subscribe(
      (provider) => {
        let mappedProvider: Provider[] = [];
        mappedProvider.push(new Provider(provider));
        this.providerSearchResults.next(mappedProvider);
      },
      (error) => {
        this.providerSearchResults.error(error); // test case that returns error
      }
      );
    return this.providerSearchResults.asObservable();
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

}
