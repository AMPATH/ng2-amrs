import { take } from 'rxjs/operators';

import { map, flatMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Provider } from '../../../models/provider.model';
import { Patient } from '../../../models/patient.model';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import * as _ from 'lodash';
import { ZscoreService } from '../../../shared/services/zscore.service';
@Injectable()
export class FormDataSourceService {
  constructor(
    private providerResourceService: ProviderResourceService,
    private locationResourceService: LocationResourceService,
    private conceptResourceService: ConceptResourceService,
    private localStorageService: LocalStorageService,
    private zscoreService: ZscoreService
  ) {}

  public getDataSources() {
    const formData: any = {
      location: this.getLocationDataSource(),
      provider: this.getProviderDataSource(),
      drug: this.getDrugDataSource(),
      problem: this.getProblemDataSource(),
      conceptAnswers: this.getWhoStagingCriteriaDataSource()
    };
    return formData;
  }

  public getLocationDataSource() {
    const resolve = (uuid: string) => {
      return this.getLocationByUuid(uuid);
    };

    const find = (text: string) => {
      return this.findLocation(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getProviderDataSource() {
    const resolve = (uuid: string) => {
      return this.getProviderByUuid(uuid);
    };
    const find = (text: string) => {
      return this.findProvider(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getDrugDataSource() {
    const resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };
    const find = (text: string) => {
      return this.findDrug(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getProblemDataSource() {
    const resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };
    const find = (text: string) => {
      return this.findProblem(text);
    };

    return {
      resolveSelectedValue: resolve,
      searchOptions: find
    };
  }

  public getConceptAnswersDataSource() {
    const datasource = {
      cachedOptions: [],
      dataSourceOptions: {
        concept: undefined
      },
      resolveSelectedValue: undefined,
      searchOptions: undefined
    };
    const find = (uuid: string) => {
      if (datasource.cachedOptions.length > 0) {
        return Observable.create((observer: Subject<any>) => {
          observer.next(datasource.cachedOptions);
        });
      }
      const valuesObservable = this.getConceptAnswers(
        datasource.dataSourceOptions.concept
      );
      valuesObservable.subscribe((results) => {
        datasource.cachedOptions = results;
      });
      return valuesObservable;
    };
    const resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };
    datasource.resolveSelectedValue = resolve;
    datasource.searchOptions = find;

    return datasource;
  }

  public getWhoStagingCriteriaDataSource() {
    const sourceChangedSubject = new Subject();

    const datasource = {
      cachedOptions: [],
      dataSourceOptions: {
        concept: undefined
      },
      resolveSelectedValue: undefined,
      searchOptions: undefined,
      dataFromSourceChanged: sourceChangedSubject.asObservable(),
      changeConcept: undefined
    };
    const find = (uuid: string) => {
      if (datasource.cachedOptions.length > 0) {
        return Observable.create((observer: Subject<any>) => {
          observer.next(datasource.cachedOptions);
        });
      }
      const valuesObservable = this.getConceptSetMembers(
        datasource.dataSourceOptions.concept
      );
      valuesObservable.subscribe((results) => {
        datasource.cachedOptions = results;
      });
      return valuesObservable;
    };
    const resolve = (uuid: string) => {
      return this.resolveConcept(uuid);
    };

    const changeConcept = (uuid: string) => {
      datasource.dataSourceOptions.concept = uuid;
      datasource.cachedOptions = [];
      sourceChangedSubject.next([]);
      find(uuid).subscribe((results) => {
        sourceChangedSubject.next(results);
      });
    };

    datasource.resolveSelectedValue = resolve;
    datasource.searchOptions = find;
    datasource.changeConcept = changeConcept;

    return datasource;
  }

  public findProvider(searchText): Observable<Provider[]> {
    const providerSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<
      any[]
    >([]);
    const findProvider = this.providerResourceService.searchProvider(
      searchText,
      false
    );
    findProvider.subscribe(
      (provider) => {
        const selectedOptions = [];
        const filtered = _.filter(provider, (p: any) => {
          if (p.person) {
            return true;
          } else {
            return false;
          }
        });
        const mappedProviders = filtered.map((p: any) => {
          return {
            value: p.uuid,
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
    const providerSearchResults: BehaviorSubject<any> =
      new BehaviorSubject<any>([]);
    return this.providerResourceService
      .getProviderByUuid(uuid, false)
      .pipe(
        map((provider) => {
          return {
            label: provider.display,
            value: provider.uuid,
            providerUuid: (provider as any).uuid
          };
        })
      )
      .pipe(
        flatMap((mappedProvider) => {
          providerSearchResults.next(mappedProvider);
          return providerSearchResults.asObservable();
        }),
        catchError((error) => {
          providerSearchResults.error(error); // test case that returns error
          return providerSearchResults.asObservable();
        })
      );
  }
  public getProviderByPersonUuid(uuid) {
    const providerSearchResults: BehaviorSubject<any> =
      new BehaviorSubject<any>([]);
    this.providerResourceService.getProviderByPersonUuid(uuid).subscribe(
      (provider) => {
        const mappedProvider = {
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
    const model: object = {};
    const gender = patient.person.gender;
    const birthdate = patient.person.birthdate;
    const age = patient.person.age;
    model['sex'] = gender;
    model['birthdate'] = birthdate;
    model['age'] = age;

    // zscore calculations addition
    // reference date to today
    const refDate = new Date();
    const zscoreRef = this.zscoreService.getZRefByGenderAndAge(
      gender,
      birthdate,
      refDate
    );
    model['weightForHeightRef'] = zscoreRef.weightForHeightRef;
    model['heightForAgeRef'] = zscoreRef.heightForAgeRef;
    model['bmiForAgeRef'] = zscoreRef.bmiForAgeRef;

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
    const locationSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<
      any[]
    >([]);
    const findLocation = this.locationResourceService.searchLocation(
      searchText,
      false
    );
    findLocation.subscribe(
      (locations) => {
        const mappedLocations = locations.map((l: any) => {
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
    const locationSearchResults: BehaviorSubject<any> =
      new BehaviorSubject<any>([]);
    return this.locationResourceService
      .getLocationByUuid(uuid, false)
      .pipe(
        map((location) => {
          return {
            label: location.display,
            value: location.uuid
          };
        })
      )
      .pipe(
        flatMap((mappedLocation) => {
          locationSearchResults.next(mappedLocation);
          return locationSearchResults.asObservable();
        }),
        catchError((error) => {
          locationSearchResults.error(error);
          return locationSearchResults.asObservable();
        })
      );
  }

  public resolveConcept(uuid): Observable<any> {
    return new Observable((observer) => {
      this.conceptResourceService.getConceptByUuid(uuid).subscribe(
        (result: any) => {
          if (result) {
            const mappedConcept = {
              label: result.name.display,
              value: result.uuid
            };
            observer.next(mappedConcept);
          }
        },
        (error) => {
          observer.next(error);
        }
      );
    });
  }

  public getConceptAnswers(uuid) {
    const conceptResult: BehaviorSubject<any> = new BehaviorSubject<any>({});
    const v = 'custom:(uuid,name,conceptClass,answers)';
    this.conceptResourceService
      .getConceptByUuid(uuid, true, v)
      .pipe(take(1))
      .subscribe(
        (result) => {
          const mappedConcepts = this.mapConcepts(result.answers);
          conceptResult.next(mappedConcepts);
        },
        (error) => {
          conceptResult.error(error);
        }
      );
    return conceptResult.asObservable();
  }

  public getConceptSetMembers(uuid) {
    const conceptResult: BehaviorSubject<any> = new BehaviorSubject<any>({});
    const v = 'custom:(uuid,name,conceptClass,setMembers)';
    this.conceptResourceService.getConceptByUuid(uuid, true, v).subscribe(
      (result) => {
        let mappedConcepts: Array<any> = this.mapConcepts(result.setMembers);
        mappedConcepts = _.sortBy(mappedConcepts, (item) => {
          return item.label;
        });
        conceptResult.next(mappedConcepts);
      },
      (error) => {
        conceptResult.error(error);
      }
    );
    return conceptResult.asObservable();
  }

  public findDrug(searchText) {
    const conceptResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.conceptResourceService
      .searchConcept(searchText)
      .subscribe((concepts) => {
        const filtered = _.filter(concepts, (concept: any) => {
          if (
            concept.conceptClass &&
            concept.conceptClass.uuid === '8d490dfc-c2cc-11de-8d13-0010c6dffd0f'
          ) {
            return true;
          } else {
            return false;
          }
        });
        const mappedDrugs = this.mapConcepts(filtered);
        conceptResults.next(mappedDrugs);
      });
    return conceptResults.asObservable();
  }

  public findProblem(searchText) {
    const conceptResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.conceptResourceService
      .searchConcept(searchText)
      .subscribe((concepts) => {
        const filtered = _.filter(concepts, (concept: any) => {
          if (
            concept.conceptClass &&
            concept.conceptClass.uuid === '8d4918b0-c2cc-11de-8d13-0010c6dffd0f'
          ) {
            return true;
          }
          if (
            concept.conceptClass &&
            concept.conceptClass.uuid === '8d492b2a-c2cc-11de-8d13-0010c6dffd0f'
          ) {
            return true;
          }
          if (
            concept.conceptClass &&
            concept.conceptClass.uuid === '8d492954-c2cc-11de-8d13-0010c6dffd0f'
          ) {
            return true;
          }
          if (
            concept.conceptClass &&
            concept.conceptClass.uuid === '8d491a9a-c2cc-11de-8d13-0010c6dffd0f'
          ) {
            return true;
          }
        });
        const mappedProblems = this.mapConcepts(filtered);
        conceptResults.next(mappedProblems);
      });
    return conceptResults.asObservable();
  }
  public mapConcepts(concepts) {
    const mappedConcepts = concepts.map((concept) => {
      return {
        value: concept.uuid,
        label: concept.name.display
      };
    });
    return mappedConcepts;
  }

  public getCachedProviderSearchResults(): any {
    const sourcekey = 'cachedproviders';
    return this.localStorageService.getObject(sourcekey);
  }

  private setCachedProviderSearchResults(searchProviderResults): void {
    const sourcekey = 'cachedproviders';
    this.localStorageService.setObject(sourcekey, searchProviderResults);
  }
}
