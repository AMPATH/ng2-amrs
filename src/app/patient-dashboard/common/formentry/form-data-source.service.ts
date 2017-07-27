import { Injectable } from '@angular/core';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Provider } from '../../../models/provider.model';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import * as _ from 'lodash';

@Injectable()

export class FormDataSourceService {

  constructor(private providerResourceService: ProviderResourceService,
              private locationResourceService: LocationResourceService,
              private conceptResourceService: ConceptResourceService,
              private localStorageService: LocalStorageService) {
  }

  public getDataSources() {

    let formData: any = {
      location: this.getLocationDataSource(),
      provider: this.getProviderDataSource(),
      drug: this.getDrugDataSource(),
      problem: this.getProblemDataSource(),
      conceptAnswers: this.getWhoStagingCriteriaDataSource()
    };
    return formData;
  }

  public getLocationDataSource() {
    let resolve = (uuid: string) => {
      return this.getLocationByUuid(uuid);
    };

    let find = (text: string) => {
      return this.findLocation(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getProviderDataSource() {
    let resolve = (uuid: string) => {
      return this.getProviderByPersonUuid(uuid);
    };
    let find = (text: string) => {
      return this.findProvider(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

 public  getDrugDataSource() {
    let resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };
    let find = (text: string) => {
      return this.findDrug(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getProblemDataSource() {
    let resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };
    let find = (text: string) => {
      return this.findProblem(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getConceptAnswersDataSource() {
    let datasource = {
      cachedOptions: [],
      dataSourceOptions: {
        concept: undefined
      },
      resolveSelectedValue: undefined,
      searchOptions: undefined
    };
    let find = (uuid: string) => {
      if (datasource.cachedOptions.length > 0) {
        return Observable.create((observer: Subject<any>) => {
          observer.next(datasource.cachedOptions);
        });
      }
      let valuesObservable = this.getConceptAnswers(datasource.dataSourceOptions.concept);
      valuesObservable.subscribe((results) => {
        datasource.cachedOptions = results;
      });
      return valuesObservable;
    };
    let resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };
    datasource.resolveSelectedValue = resolve;
    datasource.searchOptions = find;

    return datasource;

  }

  public getWhoStagingCriteriaDataSource() {
    let sourceChangedSubject = new Subject();

    let datasource = {
      cachedOptions: [],
      dataSourceOptions: {
        concept: undefined
      },
      resolveSelectedValue: undefined,
      searchOptions: undefined,
      dataFromSourceChanged: sourceChangedSubject.asObservable(),
      changeConcept: undefined
    };
    let find = (uuid: string) => {
      if (datasource.cachedOptions.length > 0) {
        return Observable.create((observer: Subject<any>) => {
          observer.next(datasource.cachedOptions);
        });
      }
      let valuesObservable = this.getConceptSetMembers(datasource.dataSourceOptions.concept);
      valuesObservable.subscribe((results) => {
        datasource.cachedOptions = results;
      });
      return valuesObservable;
    };
    let resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };

    let changeConcept = (uuid: string) => {
      datasource.dataSourceOptions.concept = uuid;
      datasource.cachedOptions = [];
      sourceChangedSubject.next([]);
      find(uuid).subscribe(
        (results) => {
          sourceChangedSubject.next(results);
        });
    };

    datasource.resolveSelectedValue = resolve;
    datasource.searchOptions = find;
    datasource.changeConcept = changeConcept;

    return datasource;

  }

  public findProvider(searchText): Observable<Provider[]> {
    let providerSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    let findProvider = this.providerResourceService.searchProvider(searchText, false);
    findProvider.subscribe(
      (provider) => {
        let selectedOptions = [];
        let filtered = _.filter(provider, (p: any) => {
          if (p.person) {
            return true;
          } else {
            return false;
          }
        });
        let mappedProviders = filtered.map((p: any) => {
          return {
            value: p.person.uuid,
            label: p.display,
            providerUuid: p.uuid
          };
        });
        this.setCachedProviderSearchResults(mappedProviders);
        providerSearchResults.next(mappedProviders.slice(0, 10));
      },
      (error) => {
        providerSearchResults.error(error); // test case that returns error
      }
    );
    return providerSearchResults.asObservable();
  }

  public getProviderByUuid(uuid): Observable<any> {
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
  public getProviderByPersonUuid(uuid) {
    let providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.providerResourceService.getProviderByPersonUuid(uuid)
      .subscribe(
      (provider) => {
        let mappedProvider = {
          label: (provider as any).display,
          value: (provider as any).person.uuid,
          providerUuid: (provider as any).uuid
        };
        providerSearchResults.next(mappedProvider);
      },
      (error) => {
        providerSearchResults.error(error); // test case that returns error
      }

      );
    return providerSearchResults.asObservable();
  }

  public getPatientObject(patient: Patient): object {
    let model: object = {};
    let gender = patient.person.gender;
    let age = patient.person.age;
    model['sex'] = gender;
    model['age'] = age;

    // define gender based constant:
    if (gender === 'F') {
        model['gendercreatconstant'] = 0.85;
    }
    if (gender === 'M') {
        model['gendercreatconstant'] = 1;
    }

    return model;
  }

  public findLocation(searchText): Observable<Location[]> {
    let locationSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    let findLocation = this.locationResourceService.searchLocation(searchText, false);
    findLocation.subscribe(
      (locations) => {
        let mappedLocations = locations.map((l: any) => {
          return {
            value: l.uuid,
            label: l.display
          };
        });
        locationSearchResults.next(mappedLocations.slice(0, 10));
      },
      (error) => {
        locationSearchResults.error(error); // test case that returns error
      }
    );
    return locationSearchResults.asObservable();
  }

  public getLocationByUuid(uuid): Observable<any> {
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

  public resolveConcept(uuid) {
    let conceptResult: BehaviorSubject<any> = new BehaviorSubject<any>({});
    this.conceptResourceService.getConceptByUuid(uuid).subscribe((result) => {
      let mappedConcept = {
        label: result.name.display,
        value: result.uuid
      };
      conceptResult.next(mappedConcept);
    }, (error) => {
      conceptResult.error(error);
    });
    return conceptResult.asObservable();
  }

  public getConceptAnswers(uuid) {
    let conceptResult: BehaviorSubject<any> = new BehaviorSubject<any>({});
    let v = 'custom:(uuid,name,conceptClass,answers)';
    this.conceptResourceService.getConceptByUuid(uuid, true, v)
      .subscribe((result) => {
        let mappedConcepts = this.mapConcepts(result.answers);
        conceptResult.next(mappedConcepts);
      }, (error) => {
        conceptResult.error(error);
      });
    return conceptResult.asObservable();

  }

  public getConceptSetMembers(uuid) {
    let conceptResult: BehaviorSubject<any> = new BehaviorSubject<any>({});
    let v = 'custom:(uuid,name,conceptClass,setMembers)';
    this.conceptResourceService.getConceptByUuid(uuid, true, v)
      .subscribe((result) => {
        let mappedConcepts: Array<any> = this.mapConcepts(result.setMembers);
        mappedConcepts = _.sortBy(mappedConcepts, (item) => {
          return item.label;
        });
        conceptResult.next(mappedConcepts);
      }, (error) => {
        conceptResult.error(error);
      });
    return conceptResult.asObservable();
  }

  public findDrug(searchText) {
    let conceptResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.conceptResourceService.searchConcept(searchText).subscribe((concepts) => {
      let filtered = _.filter(concepts, (concept: any) => {
        if (concept.conceptClass &&
          concept.conceptClass.uuid === '8d490dfc-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        } else {
          return false;
        }
      });
      let mappedDrugs = this.mapConcepts(filtered);
      conceptResults.next(mappedDrugs);
    });
    return conceptResults.asObservable();
  }

  public findProblem(searchText) {
    let conceptResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.conceptResourceService.searchConcept(searchText).subscribe((concepts) => {
      let filtered = _.filter(concepts, (concept: any) => {
        if (concept.conceptClass &&
          concept.conceptClass.uuid === '8d4918b0-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        }
        if (concept.conceptClass &&
          concept.conceptClass.uuid === '8d492b2a-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        }
        if (concept.conceptClass &&
          concept.conceptClass.uuid === '8d492954-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        }
        if (concept.conceptClass &&
          concept.conceptClass.uuid === '8d491a9a-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        }
      });
      let mappedProblems = this.mapConcepts(filtered);
      conceptResults.next(mappedProblems);
    });
    return conceptResults.asObservable();
  }
  public mapConcepts(concepts) {
    let mappedConcepts = concepts.map((concept) => {
      return {
        value: concept.uuid,
        label: concept.name.display
      };
    });
    return mappedConcepts;
  }

  public getCachedProviderSearchResults(): any {
    let sourcekey = 'cachedproviders';
    return this.localStorageService.getObject(sourcekey);
  }

  private setCachedProviderSearchResults(searchProviderResults): void {
    let sourcekey = 'cachedproviders';
    this.localStorageService.setObject(sourcekey, searchProviderResults);
  }
}
