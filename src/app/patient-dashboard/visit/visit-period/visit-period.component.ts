import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import * as _ from 'lodash';
import { PatientService } from '../../patient.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { ConfirmationService } from 'primeng/primeng';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'visit-period',
  templateUrl: 'visit-period.component.html',
  styleUrls: ['visit-period.component.css']
})
export class VisitPeriodComponent implements OnInit, OnDestroy {

  errors: any[] = [];
  patientSubscription: Subscription;
  routeSubscription: Subscription;
  visitSubscription: Subscription;
  loadingVisitPeriod: boolean = true;
  encounterVisitUuid: string = '';
  encounterUuid: string = '';
  startDatetime: string = '';
  stopDatetime: string = '';
  encounters: any[] = [];
  data: any;
  genderOptions: any;
  locationUuid: string;
  loaderStatus: boolean;
  locations = [];
  loadedInitialLocation: boolean = false;
  loadingVisit: boolean = true;
  editLocation: boolean = true;
  visitLocation: any;
  currentVisit: any;
  currentVisitType: any;
  locationName: string = '';

  @Output() editedLocation = new EventEmitter();

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

  ngOnInit(): void {
    this.subscribeToPatientChangeEvent();
    this.subscribeToRouteChangeEvent();
    this.getLocations();
    setTimeout(() => {
      this.setInitialLocation();
    }, 3000);
  }

  ngOnDestroy(): void {
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

  subscribeToRouteChangeEvent() {

    if (this.route && this.route.queryParams) {
      this.routeSubscription = this.route.queryParams.subscribe((params) => {
        this.resetVariables();
        console.log('visit params', params);
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
          console.log('No visit or encounter info on url');
        }

      });
    }
  }

  loadVisitByEncounter(encounterUuid) {
    this.loadingVisit = true;
    let visit = this.getEncounterVisit(encounterUuid);
    this.loadingVisit = false;
    if (visit) {
      this.setVisit(visit);
    } else {
      console.log('No visit found for selected encounter', this.encounters);
    }
  }

  subscribeToPatientChangeEvent() {

    this.patientSubscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        // this.resetVariables();
        if (patient !== null) {
          this.encounters = patient.encounters;

        } else {
          console.log('No patient');
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
      console.log(error);
    });
  }


  public loadedLocation(event) {
    if (event && this.encounterVisitUuid && this.locationUuid && this.locationUuid !== event) {

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
              console.log('updated the location to ' + this.locationName);
            });
        },
        reject: () => {
          console.log('Location Not Changed');
        }
      });
    }
  }

  private setInitialLocation() {
    this.locationUuid = this.currentVisit && this.currentVisit.location ?
      this.currentVisit.location.uuid : '';
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
    console.log('visitvisitvisit', visit);
    this.locationName = visit ? visit.location.display : null;
    this.encounterVisitUuid = visit ? visit.uuid : null;
    this.currentVisitType = visit && visit.visitType ? visit.visitType.name : null;
    this.loadingVisit = false;
    console.log('visitvisitvisit  this.locationName ', this.locationName);
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


