import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription ,  BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import * as _ from 'lodash';
import { PatientService } from '../../../services/patient.service';
import { LocationResourceService } from '../../../../openmrs-api/location-resource.service';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'visit-period',
  templateUrl: './visit-period.component.html',
  styleUrls: ['./visit-period.component.css']
})
export class VisitPeriodComponent implements OnInit, OnDestroy {

  public errors: any[] = [];
  public patientSubscription: Subscription;
  public routeSubscription: Subscription;
  public visitSubscription: Subscription;
  public loadingVisitPeriod: boolean = true;
  public encounterVisitUuid: string = '';
  public encounterUuid: string = '';
  public startDatetime: string = '';
  public stopDatetime: string = '';
  public encounters: any[] = [];
  public data: any;
  public genderOptions: any;
  public locationUuid: string;
  public loaderStatus: boolean;
  public locations = [];
  public loadedInitialLocation: boolean = false;
  public loadingVisit: boolean = true;
  public editLocation: boolean = true;
  public visitLocation: any;
  public currentVisit: any;
  public currentVisitType: any;
  public locationName: string = '';

  @Output() public editedLocation = new EventEmitter();

  @Input()
  set visitUuid(value) {
    if (value) {
      this.getVisitPeriod(value);
    }
  }

  @Input()
  set iseditLocation(value) {
    this.editLocation = value;
  }

  constructor(private patientService: PatientService, private visitResource: VisitResourceService,
              private router: Router, private route: ActivatedRoute,
              private locationResourceService: LocationResourceService,
              private confirmationService: ConfirmationService) {

  }

  public ngOnInit(): void {
    this.subscribeToPatientChangeEvent();
    this.subscribeToRouteChangeEvent();
    this.getLocations();
    setTimeout(() => {
      this.setInitialLocation();
    }, 3000);
  }

  public ngOnDestroy(): void {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.visitSubscription) {
      this.visitSubscription.unsubscribe();
    }
  }

  public subscribeToRouteChangeEvent() {

    if (this.route && this.route.queryParams) {
      this.routeSubscription = this.route.queryParams.subscribe((params) => {
        this.resetVariables();
        if (params['visitUuid'] && this.encounterVisitUuid !== params['visitUuid']) {
          // new form being entered therefore reset enouncter uuid
          this.encounterUuid = undefined;
          this.encounterVisitUuid = params['visitUuid'];
          this.data = this.getVisitPeriod(this.encounterVisitUuid);
          this.editLocation = false;
        } else if (params['encounter'] && this.encounterUuid !== params['encounter']) {
          this.encounterUuid = params['encounter'];
          this.loadVisitByEncounter(this.encounterUuid);
        } else {
          // console.error('No visit or encounter info on url');
        }

      });
    }
  }

  public loadVisitByEncounter(encounterUuid) {
    this.loadingVisit = true;
    let visit = this.getEncounterVisit(encounterUuid);
    this.loadingVisit = false;
    if (visit) {
      this.setVisit(visit);
    } else {
      // console.error('No visit found for selected encounter', this.encounters);
    }
  }

  public subscribeToPatientChangeEvent() {

    this.patientSubscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        // this.resetVariables();
        if (patient !== null) {
          this.encounters = patient.encounters;
        } else {
          // console.error('No patient');
        }

        if (this.encounterUuid) {
          this.loadVisitByEncounter(this.encounterUuid);
        }
      }
      , (err) => {
        console.error('An error occured while fetching the patient', err);
        this.resetVariables();
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public getLocations() {
    this.loaderStatus = true;
    this.locationResourceService.getLocations().subscribe((results: any) => {
      this.locations = results.map((location) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });
      this.loaderStatus = false;
    }, (error) => {
      this.loaderStatus = false;
      console.error('Error loading locations', error);
    });
  }

  public loadedLocation(event) {
    if (event && this.encounterVisitUuid && this.currentVisit && this.currentVisit.location

      && this.currentVisit.location.uuid !== event.value) {

      let visitPayload = {
        location: event.value
      };

      this.confirmationService.confirm({
        header: 'Change visit location',
        message: 'This will change the visit location ' +
        'upon confirmation. Do you want to continue?',
        accept: () => {
          this.loadingVisit = true;

          this.visitResource.updateVisit(this.encounterVisitUuid, visitPayload)
            .subscribe((updateVisit) => {
              this.loadingVisit = false;
              this.locationName = updateVisit.location.display;
              this.editLocation = !this.editLocation;
              this.editedLocation.emit(this.editLocation);
            });
        },
        reject: () => {
        }
      });
    }
  }

  private setInitialLocation() {
    this.locationUuid = this.currentVisit && this.currentVisit.location ?
      this.currentVisit.location.display : '';
  }

  private getEncounterVisit(encounterUuid) {
    if (this.encounters.length === 0) {
      return null;
    }
    let filtered = _.filter(this.encounters, (encounter: any) => {
      if (encounter.uuid === encounterUuid) {
        return true;
      } else {
        return false;
      }
    });

    if (filtered.length === 1 && filtered[0].visit) {
      return filtered[0].visit;
    } else {
      return null;
    }

  }

  private getVisitPeriod(uuid) {
    let custom = 'custom:(uuid,' +
      'location:ref' +
      '),' +
      'visitType:(uuid,name),location:ref,startDatetime,' +
      'stopDatetime)';
    this.loadingVisit = true;
    this.visitSubscription = this.visitResource.getVisitByUuid(uuid, { v: custom })
      .subscribe((visit) => {
        this.setVisit(visit);
      });
  }

  private setVisit(visit) {
    this.stopDatetime = visit.stopDatetime;
    this.startDatetime = visit.startDatetime;
    this.currentVisit = visit ? visit : '';
    this.locationUuid = visit ? visit.location.uuid : null;
    this.locationName = visit ? visit.location.display : null;
    this.encounterVisitUuid = visit ? visit.uuid : null;
    this.currentVisitType = visit && visit.visitType ? visit.visitType.name : null;
    this.loadingVisit = false;
  }

  private resetVariables() {
    this.loadingVisitPeriod = false;
    this.stopDatetime = '';
    this.startDatetime = '';
    this.encounterVisitUuid = '';
    this.currentVisit = '';
    this.locationUuid = '';
    this.currentVisitType = '';
  }
}
