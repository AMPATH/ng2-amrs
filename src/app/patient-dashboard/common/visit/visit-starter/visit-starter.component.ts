import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserDefaultPropertiesService } from
  '../../../../user-default-properties/index';
import { PatientProgramResourceService } from
  '../../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';

@Component({
  selector: 'app-visit-starter',
  templateUrl: './visit-starter.component.html',
  styleUrls: ['./visit-starter.component.css']
})
export class VisitStarterComponent implements OnInit {

  public programVisitsConfig: any = {};

  @Output()
  public visitStarted = new EventEmitter<any>();

  public isBusy: boolean = false;
  public error: string = '';

  private _patientUuid: string;
  @Input()
  public get patientUuid(): string {
    return this._patientUuid;
  }
  public set patientUuid(v: string) {
    this._patientUuid = v;
  }

  private _programUuid: string;
  @Input()
  public get programUuid(): string {
    return this._programUuid;
  }
  public set programUuid(v: string) {
    this._programUuid = v;
  }

  private _programEnrollmentUuid: string;
  @Input()
  public get programEnrollmentUuid(): string {
    return this._programEnrollmentUuid;
  }
  public set programEnrollmentUuid(v: string) {
    this._programEnrollmentUuid = v;
  }

  private _selectedLocations: Array<string> = [];
  public get selectedLocations(): Array<string> {
    return this._selectedLocations;
  }
  public set selectedLocations(v: Array<string>) {
    this._selectedLocations = v;
    this.getCurrentProgramEnrollmentConfig();
  }

  public get selectedLocation(): string {
    return this._selectedLocations.length > 0 ? this._selectedLocations[0] : '';
  }
  public set selectedLocation(v: string) {
    if (v !== this.selectedLocation) {
      this.selectedLocations = [v];
    }
  }

  public get visitTypes(): Array<any> {
    if (this.programVisitsConfig &&
      this.programVisitsConfig.visitTypes &&
      this.programVisitsConfig.visitTypes.allowed) {
      return this.programVisitsConfig.visitTypes.allowed;
    }
    return [];
  }

  public get disallowedVisitTypes(): Array<any> {
    if (this.programVisitsConfig &&
      this.programVisitsConfig.visitTypes &&
      this.programVisitsConfig.visitTypes.disallowed) {
      return this.programVisitsConfig.visitTypes.disallowed;
    }
    return [];
  }

  constructor(
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private patientProgramResourceService: PatientProgramResourceService,
    private visitResourceService: VisitResourceService
  ) { }

  public ngOnInit() {
    this.setUserDefaultLocation();
    // this.getCurrentProgramEnrollmentConfig();
  }

  public setUserDefaultLocation() {
    let location: any = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    if (location && location.uuid) {
      this._selectedLocations.push(location.uuid);
    }
  }

  public getCurrentProgramEnrollmentConfig() {
    if (this.programEnrollmentUuid === '') {
      return;
    }
    this.isBusy = true;
    this.programVisitsConfig = {};
    this.error = '';
    this.patientProgramResourceService
      .getPatientProgramVisitTypes(this.patientUuid,
      this.programUuid, this.programEnrollmentUuid, this.selectedLocation)
      .subscribe(
      (progConfig) => {
        this.isBusy = false;
        this.programVisitsConfig = progConfig;
      },
      (error) => {
        this.isBusy = false;
        this.error = 'Error loading the program visit configs. Please refresh page and retry.';
        console.error('Error loading the program visit configs', error);
      });
  }

  public startVisit(visitTypeUuid) {
    this.isBusy = true;
    this.error = '';
    let payload = {
      patient: this.patientUuid,
      location: this.selectedLocation,
      startDatetime: new Date(),
      visitType: visitTypeUuid
    };

    this.visitResourceService.saveVisit(payload).subscribe(
      (savedVisit) => {
        this.isBusy = false;
        this.visitStarted.emit(savedVisit);
      },
      (error) => {
        this.isBusy = false;
        this.error = 'Error starting visit';
        console.error('Error starting visit', error);
      }
    );
  }

  public onLocationChanged(locations) {
    this.selectedLocation = locations.locations;
  }

}
