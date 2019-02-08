import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, BehaviorSubject, Subject, Subscriber } from 'rxjs/Rx';

import * as _ from 'lodash';
import { DrugResourceService } from 'src/app/openmrs-api/drug-resource.service';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { OderSetResourceService } from 'src/app/openmrs-api/oder-set-resource.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';


@Injectable()

export class DrugOrderService {
  public secureUrl: SafeResourceUrl;
  constructor(
    private drugResourceService: DrugResourceService,
    private orderSetResourceService: OderSetResourceService ,
    private providerResourceService: ProviderResourceService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    protected appSettingsService: AppSettingsService,
    private locationResourceService: LocationResourceService,
    private orderResourceService: OrderResourceService,
  ) { }

  public findDrug(searchText) {
    const drugResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.drugResourceService.searchDrug(searchText).subscribe((drugs) => {
      const filtered = _.filter(drugs, (drug: any) => {
        if (drug.concept.conceptClass &&
          drug.concept.conceptClass.uuid === '8d490dfc-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        } else {
          return false;
        }
      });
      const mappedDrugs = this.mapDrugs(filtered);
      drugResults.next(mappedDrugs);
    });
    return drugResults.asObservable();
  }
  public findDrugByUuid(drugId) {
 const drugSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.drugResourceService.getDrugByUuid(drugId).subscribe((drugs) => {
        const mappedDrug = {
          label: (drugs as any).display,
          value: (drugs as any).strength,
        };
        drugSearchResults.next(mappedDrug);
      },
      (error) => {
        drugSearchResults.error(error);
      }

    );
  return drugSearchResults.asObservable();
}


  public mapDrugs(drugs) {
    const mappedDrugs = drugs.map((drug) => {
      return {
        uuid: drug.uuid,
        name: drug.name,
        concept: drug.concept,
        dosageForm: drug.dosageForm,
        route: drug.route,
        strength: drug.strength
      };
    });
    return mappedDrugs;
  }
  public findDrugSets(searchText) {
    const drugSetResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.orderSetResourceService.searchDrugOrderSet(searchText).subscribe((drugSets) => {
      const filtered = _.filter(drugSets, (drugorderset: any) => {
        if (drugorderset.orderSetMembers.orderType &&
          drugorderset.orderSetMembers.orderType.uuid === '8d490dfc-c2cc-11de-8d13-0010c6dffd0f') {
          return true;
        } else {
          return false;
        }
      });
      const mappedDrugSets = this.mapDrugs(filtered);
      drugSetResults.next(mappedDrugSets);
    });
    return drugSetResults.asObservable();
  }
  public getProviderByPersonUuid(uuid) {
    const providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.providerResourceService.getProviderByPersonUuid(uuid)
      .subscribe(
        (provider) => {
          const mappedProvider = {
            label: (provider as any).display,
            value: (provider as any).person.uuid,
            providerUuid: (provider as any).uuid
          };
          providerSearchResults.next(mappedProvider);
        },
        (error) => {
          providerSearchResults.error(error);
        }

      );
    return providerSearchResults.asObservable();
  }
  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `generate`;
}
  public findLocation(searchText): Observable<Location[]> {
    const locationSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    const findLocation = this.locationResourceService.searchLocation(searchText, false);
    findLocation.subscribe(
      (locations) => {
        const mappedLocations = locations.map((l: any) => {
          return {
            value: l.uuid,
            label: l.display
          };
        });
        locationSearchResults.next(mappedLocations);
      },
      (error) => {
        locationSearchResults.error(error);
      }
    );
    return locationSearchResults.asObservable();
  }

  public saveOrder(payload) {
    return this.orderResourceService.saveDrugOrder(payload);
  }
  public printPdf(payload): Observable<any> {
    // const url = this.getUrl();
    const url = 'https://ngx.ampath.or.ke/etl-server-test-internal9/generate';
    console.log(url);
    return new Observable((observer: Subscriber<any>) => {
      //  console.log(this.http.post(url, payload));
      let objectUrl: string = null;
        const headers = new HttpHeaders({ 'Accept': 'image/png,image/jpeg,image/gif,application/pdf' });
       this.http
            .post(url, payload, {headers,
              responseType: 'blob'}).pipe(
                take(1)).subscribe((m) => {
                        this.secureUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(m));
                        observer.next(this.secureUrl);
                });
                return () => {
                  if (objectUrl) {
                      URL.revokeObjectURL(null);
                      objectUrl = null;
                  }
              };
          });


}
}
