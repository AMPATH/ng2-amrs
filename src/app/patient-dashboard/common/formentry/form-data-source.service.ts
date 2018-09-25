
import {map,  flatMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Provider } from '../../../models/provider.model';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import * as _ from 'lodash';
import * as Moment from 'moment';
const bfaMale5Above = require('../../../../assets/zscore/bfa_boys_5_above.json');
const wflMaleBelow5 = require('../../../../assets/zscore/wfl_boys_below5.json');
const hfaMale5Above = require('../../../../assets/zscore/hfa_boys_5_above.json');
const hfaMaleBelow5 = require('../../../../assets/zscore/hfa_boys_below5.json');

const bfaFemale5Above = require('../../../../assets/zscore/bfa_girls_5_above.json');
const wflFemaleBelow5 = require('../../../../assets/zscore/wfl_girls_below5.json');
const hfaFemale5Above = require('../../../../assets/zscore/hfa_girls_5_above.json');
const hfaFemaleBelow5 = require('../../../../assets/zscore/hfa_girls_below5.json');
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
      return this.getProviderByUuid(uuid);
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
    let providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    return this.providerResourceService.getProviderByUuid(uuid, false).pipe(
      map(
      (provider) => { return {
          label: provider.display,
          value: provider.uuid,
          providerUuid: (provider as any).uuid
        };
      })).pipe(
          flatMap((mappedProvider) => {
                     providerSearchResults.next(mappedProvider);
                     return providerSearchResults.asObservable();
      }),
       catchError((error) => {
        providerSearchResults.error(error); // test case that returns error
        return providerSearchResults.asObservable();
      }));
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
    let birthdate = patient.person.birthdate;
    model['sex'] = gender;
    model['age'] = age;
    model['birthdate'] = birthdate;
    const ageInMonths = Moment().diff(birthdate, 'months');
    const ageInDays = Moment().diff(birthdate, 'days');
    // define gender based constant:
    if (gender === 'F') {
        model['gendercreatconstant'] = 0.85;

        if ( age < 5 ) {
          model['weightForHeightRef'] = wflFemaleBelow5;
          model['heightForAgeRef'] = this.getZscoreRef(hfaFemaleBelow5, 'Day', ageInDays);
          }
          if ( age > 5 && age < 18 ) {
            model['bmiForAgeRef'] =  this.getZscoreRef(bfaFemale5Above, 'Month', ageInMonths);
            model['heightForAgeRef'] = this.getZscoreRef(hfaFemale5Above, 'Month', ageInMonths);
          }

    }
    if (gender === 'M') {
        model['gendercreatconstant'] = 1;
        if ( age < 5 ) {
        model['weightForHeightRef'] = wflMaleBelow5;
        model['heightForAgeRef'] = this.getZscoreRef(hfaMaleBelow5, 'Day', ageInDays);
        }

        if ( age > 5 && age < 18 ) {
          model['bmiForAgeRef'] =  this.getZscoreRef(bfaMale5Above, 'Month', ageInMonths);
          model['heightForAgeRef'] = this.getZscoreRef(hfaMale5Above, 'Month', ageInMonths);
        }

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
    const locationSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    return this.locationResourceService.getLocationByUuid(uuid, false).pipe(
      map(
      (location) => { return {
          label: location.display,
          value: location.uuid
        }; })).pipe(
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

  private getZscoreRef(refData, searchKey, searchValue): any {
    return _.filter(refData, (refObject) => {
       return refObject[searchKey] === searchValue;
    });
  }
}
