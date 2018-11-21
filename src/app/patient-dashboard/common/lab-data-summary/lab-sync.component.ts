import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { LabsResourceService } from '../../../etl-api/labs-resource.service';
import { PatientService } from '../../services/patient.service';
import * as Moment from 'moment';
import { combineLatest, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'lab-sync',
  templateUrl: './lab-sync.component.html',
  styleUrls: ['./lab-sync.component.css']
})
export class LabSyncComponent implements OnInit, OnDestroy {
  public patient: any;
  public results = [];
  public error: string;
  public loadingPatient: boolean;
  public fetchingResults: boolean;
  private subscription: Subscription;

  constructor(private labsResourceService: LabsResourceService,
              private patientService: PatientService) {
  }

  public ngOnInit() {
    this.loadingPatient = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.loadingPatient = false;
        if (patient) {
          this.patient = patient;
          this.getNewResults();
        }
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getNewResults() {
    this.fetchingResults = true;
    this.error = undefined;
    this.getCombinedResult().pipe(take(1)).subscribe((results: any[]) => {
      this.fetchingResults = false;
      // the intention of combining is to have both systems sync. So we take just one result
      const result = results[1];
      if (result.errors && result.errors.length > 0) {
        this.error = result.errors;
      } else {
        this.results = this.processResult(result);
      }
    }, (err) => {
      this.fetchingResults = false;
      this.error = err;
    });
  }

  public getCombinedResult(): Observable<any[]> {
    let startDate = Moment('2006-01-01').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    let endDate = Moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    const batch: Observable<any>[] = [];
    batch.push(this.labsResourceService.getNewPatientLabResults({
      startDate: startDate,
      endDate: endDate,
      patientUuId: this.patient.person.uuid
    }));
    batch.push(this.labsResourceService.getUpgradePatientLabResults({
      patientUuid: this.patient.person.uuid
    }));
    return combineLatest(batch);
  }

  public processResult(results: any) {

    let data: any = [];

    for (let result of results) {
      if (result && result.concept && result.concept.display === 'CD4 PANEL') {
        let cd4Result: any = {
          isCd4Result: true,
          groupMembers: result.groupMembers
        };

        for (let member of result.groupMembers) {
          switch (member.concept.uuid) {
            case 'a8a8bb18-1350-11df-a1f1-0026b9348838':
              cd4Result.cd4 = member.value;
              break;
            case 'a8970a26-1350-11df-a1f1-0026b9348838':
              cd4Result.cd4Percent = member.value;
              break;
            default:
              break;
          }
        }

        data.push(cd4Result);
      } else {
        data.push(result);
      }
    }
    return data;
  }
}
