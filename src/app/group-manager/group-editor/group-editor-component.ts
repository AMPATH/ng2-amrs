import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import { Subject } from 'rxjs';
import { UserDefaultPropertiesService } from '../../user-default-properties';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { CommunityGroupAttributeService } from '../../openmrs-api/community-group-attribute-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { Input } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { ActivatedRoute } from '@angular/router';

const DEFAULT_GROUP_TYPE = 'community_group';
const HIV_DIFFERENTIATED_CARE_PROGRAM = {
  label: 'HIV DIFFERENTIATED CARE PROGRAM',
  value: '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
};
@Component({
  selector: 'group-editor',
  templateUrl: './group-editor-component.html',
  styleUrls: ['./group-editor-component.css']
})
export class GroupEditorComponent implements OnInit {
  public departmentNames = [];
  public departmentPrograms = [];
  public defaultDepartment = '';
  public selectedProviderUuid: string;
  public providers: any = [];
  public facilities: any = [];
  public groupNo: string;
  public groupUuid: string;
  public groupName: string;
  public facility: any;
  public provider: any;
  public address: string;
  public groupType: any;
  public editType = 'create';
  public actionButtonText = `${this.editType} Group`;
  public groupTypes: any = [];
  public groupPrograms: any = [];
  public groupActivities: string[] = [
    'Tailoring',
    'Art WorldTable',
    'Tennis',
    'Chess',
    'Football',
    'ReadingDarts',
    'Farming',
    'None'
  ];
  public groupProgram: any;
  public groupActivity: any;
  public success = false;
  public showGroupActivity = false;
  public otzProgramUuid = '203571d6-a4f2-4953-9e8b-e1105e2340f5';
  public message = '';
  public busy = false;
  public providerLoading;
  public currentLoggedInProvider;
  public groupNumberPattern = /\d{5}-\d{5}/;
  public groupNamePattern = /[a-zA-Z]+/;
  public groupNoErrorMessage = '';
  public allGroupNumbers = [];
  public saving = false;
  public providerSuggest: Subject<any> = new Subject();
  @Output() newLocation: EventEmitter<any> = new EventEmitter();
  @Input() set state(state) {
    this.groupNo = state.groupNo;
    this.groupUuid = state.groupUuid;
    this.groupName = state.groupName;
    this.groupProgram = state.groupProgram;
    this.groupActivity = state.groupActivity;
    this.facility = state.facility;
    this.provider = state.provider;
    this.address = state.address;
    this.groupType = state.groupType;
    this.editType = state.editType || 'create';
    state.actionButtonText
      ? (this.actionButtonText = state.actionButtonText)
      : (this.actionButtonText = `${this.editType} Group`);
  }
  @Output() hide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newGroup: EventEmitter<any> = new EventEmitter();
  @Output() creatingGroup: EventEmitter<boolean> = new EventEmitter();
  @Output() updatedGroup: EventEmitter<any> = new EventEmitter();

  constructor(
    private _communityService: CommunityGroupService,
    private _providerResourceService: ProviderResourceService,
    private _locationSservice: LocationResourceService,
    private _communityAttributeService: CommunityGroupAttributeService,
    private userResourceService: UserService,
    private userLocationService: UserDefaultPropertiesService,
    private providerResourceService: ProviderResourceService,
    private programResourceService: ProgramResourceService,
    private departmentProgramConfigService: DepartmentProgramsConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.allFacilities();
    this.fetchAllGroupNumbers();
    this.setUpProviderTypeAhead();
    this.fetchDepartmentProgramConfig(true);
    if (this.editType.toLowerCase() === 'create') {
      this.getLoggedInProvider();
      this.getCurrentUserLocation();
      this.setDefaultProgram();
      this.autoGenerateGroupNumber();
    }
    if (
      this.editType.toLowerCase() === 'edit' &&
      this.groupProgram.value === this.otzProgramUuid
    ) {
      this.showGroupActivity = true;
    }

    this.route.parent.parent.parent.url.subscribe((urlSegment: any) => {
      if (!_.isEmpty(this.facilities)) {
        this.facility = _.find(
          this.facilities,
          (facility) => urlSegment[0].path === facility.value
        );
        this.newLocation.emit(this.facility);
        this.autoGenerateGroupNumber();
      }
    });
  }

  private autoGenerateGroupNumber() {
    this._communityService
      .generateGroupNumber(this.facility.value ? this.facility.value : '')
      .subscribe((res: any) => {
        this.groupNo = res.groupNumber;
      });
  }

  private autoGenerateOTZGroupNumber() {
    this._communityService
      .generateGroupNumber(this.facility.value ? this.facility.value : '')
      .subscribe((res: any) => {
        this.groupNo = res.groupNumber.replace(/DC/g, 'OTZ');
      });
  }

  public setUpProviderTypeAhead() {
    this.providerSuggest
      .pipe(
        debounceTime(350),
        switchMap((term: string) =>
          this.providerResourceService.searchProvider(term)
        )
      )
      .subscribe((data) => this.processProviders(data));
  }

  public fetchAllGroupNumbers() {
    this._communityAttributeService
      .getAttributesByAttributeType('groupNumber')
      .subscribe((attributes) => {
        _.forEach(attributes, (attribute) => {
          this.allGroupNumbers.push(attribute.value);
        });
      });
  }

  public allFacilities() {
    this._locationSservice.getLocations().subscribe((result: any) => {
      this.facilities = result.map((location: any) => {
        return {
          label: location.display,
          value: location.uuid
        };
      });
    });
  }
  public selectProvider(provider) {
    this.provider = provider.name;
    this.selectedProviderUuid = provider.uuid;
    this.providers = [];
  }
  public searchProvider(providerSearchTerm) {
    if (providerSearchTerm.length > 3) {
      this._providerResourceService
        .searchProvider(providerSearchTerm)
        .subscribe((results) => {
          if (results) {
            this.processProviders(results);
          }
        });
    }
    if (providerSearchTerm.length === 0) {
      this.selectedProviderUuid = '';
    }
  }

  public checkGroupNumber(enteredGroupNumber) {
    this.groupNo = enteredGroupNumber;
    const check = _.filter(
      this.allGroupNumbers,
      (groupNumber) => this.groupNo === groupNumber
    );
    if (this.editType.toLowerCase() === 'create') {
      check.length > 0
        ? (this.groupNoErrorMessage = 'Group Number Already Exists!')
        : (this.groupNoErrorMessage = '');
    } else {
      check.length > 1
        ? (this.groupNoErrorMessage = 'Group Number Already Exists!')
        : (this.groupNoErrorMessage = '');
    }
  }

  public createUpdateGroup() {
    this.resetMessage();
    this.busy = true;
    const formValid = this.formValid();
    if (formValid) {
      this.creatingGroup.emit(true);
      this.saving = true;
      if (this.editType.toLowerCase() === 'edit') {
        this.updateGroup();
      }
      if (this.editType.toLowerCase() === 'create') {
        this.createGroup();
      }
    } else {
      this.success = false;
      this.message = 'Please ensure you have filled all the fields';
      this.busy = false;
    }
  }
  public createGroup() {
    const payLoad = this.generatePayload();
    this._communityService.createGroup(payLoad).subscribe(
      (result) => {
        this.newGroup.emit(result);
      },
      (error) => {
        this.message = 'Error creating cohort group, kindly try again';
        this.success = false;
        this.busy = false;
      }
    );
  }

  public generatePayload() {
    const attributes: any = [];
    if (this.groupNo !== '') {
      attributes.push({
        cohortAttributeType: 'groupNumber',
        value: this.groupNo
      });
    }
    if (this.address !== '') {
      attributes.push({
        cohortAttributeType: 'landmark',
        value: this.address
      });
    }
    if (this.provider !== '') {
      attributes.push({
        cohortAttributeType: 'provider',
        value: this.provider['value']
      });
    }
    if (this.groupProgram !== '') {
      attributes.push({
        cohortAttributeType: 'programUuid',
        value: this.groupProgram['value']
      });
    }
    if (this.groupActivity !== '') {
      attributes.push({
        cohortAttributeType: 'groupActivity',
        value: this.groupActivity
      });
    }
    const payLoad = {
      name: this.groupName,
      description: '',
      location: this.facility.value,
      startDate: Moment().format('YYYY-MM-DD'),
      cohortType: DEFAULT_GROUP_TYPE,
      groupCohort: true,
      attributes: attributes
    };
    return payLoad;
  }

  public updateGroup() {
    const payLoad = this.generatePayload();
    this._communityService.updateCohortGroup(payLoad, this.groupUuid).subscribe(
      (results) => {
        this.message = 'Cohort Group has been Succesfully Updated';
        this.success = true;
        this.busy = false;
        this.updatedGroup.emit(results);
      },
      (error) => {
        this.message = 'Error updating cohort group, kindly try again';
        this.success = false;
        this.busy = false;
      }
    );
  }

  public resetMessage() {
    this.success = false;
    this.message = '';
  }
  public resetValues() {
    this.facility = {};
    this.groupNo = '';
    this.groupType = {};
    this.groupProgram = {};
    this.groupActivity = {};
    this.address = '';
    this.provider = '';
    this.success = false;
    this.message = '';
    this.groupName = '';
  }
  public formValid() {
    const payLoad = {
      name: this.groupName,
      description: '',
      location: this.facility,
      cohortType: DEFAULT_GROUP_TYPE,
      cohortProgram: this.groupProgram,
      groupNo: this.groupNo
    };
    if (
      payLoad.name === '' ||
      !payLoad.location ||
      !payLoad.cohortType ||
      !payLoad.cohortProgram ||
      payLoad.groupNo === ''
    ) {
      return false;
    } else {
      return true;
    }
  }

  public fetchProviderOptions(term: string = null) {
    if (!_.isNull(term)) {
      this.providers = [];
      this.providerLoading = true;
    }
    const findProvider = this.providerResourceService.searchProvider(
      term,
      false
    );
    findProvider.subscribe(
      (providers) => {
        this.processProviders(providers);
      },
      (error) => {
        console.error(error); // test case that returns error
      }
    );
    return findProvider;
  }

  private processProviders(providers) {
    this.providerLoading = false;
    const filteredProviders = _.filter(
      providers,
      (p: any) => !_.isNil(p.person)
    );
    this.providers = filteredProviders.map((provider) => {
      return {
        label: provider.person.display,
        value: provider.person.uuid
      };
    });
  }

  public getLoggedInProvider() {
    const providerPersonUuid = this.userResourceService.getLoggedInUser()
      .personUuid;
    this.providerResourceService
      .getProviderByPersonUuid(providerPersonUuid)
      .subscribe((provider: any) => {
        this.provider = {
          label: provider.person.display,
          value: providerPersonUuid
        };
      });
  }

  public getCurrentUserLocation() {
    const location = this.userLocationService.getCurrentUserDefaultLocationObject();
    if (location) {
      this.facility = { label: location.display, value: location.uuid };
    }
  }

  public setDefaultProgram() {
    this.groupProgram = HIV_DIFFERENTIATED_CARE_PROGRAM;
  }

  public fetchDepartmentProgramConfig(onInit = false) {
    this.departmentProgramConfigService
      .getDartmentProgramsConfig()
      .subscribe((response) => {
        const departments = [];
        const departmentUuids = Object.keys(response);
        _.forEach(response, (dept) => {
          this.departmentPrograms.push(dept);
          this.departmentNames.push(dept.name);
        });
        if (this.editType.toLowerCase() === 'create') {
          this.defaultDepartment = 'HIV';
        } else {
          this.defaultDepartment = this.getDepartmentByProgram(
            this.groupProgram.value,
            this.departmentPrograms
          );
        }
        this.filterProgramsByDepartment(this.defaultDepartment, onInit);
      });
  }

  public getDepartmentByProgram(
    programUuid: string,
    departmentPrograms: any
  ): string {
    let department = null;
    _.forEach(departmentPrograms, (dept) => {
      const found = _.find(
        dept.programs,
        (program) => program.uuid === programUuid
      );
      if (found) {
        department = dept.name;
      }
      return _.isUndefined(found);
    });
    return department;
  }

  public filterProgramsByDepartment(departmentName, onInit = false) {
    if (!onInit) {
      this.groupProgram = null;
    }
    if (departmentName) {
      const department = this.departmentPrograms.filter(
        (dept) => dept.name === departmentName
      );
      const programs = department[0].programs;
      this.groupPrograms = programs.map((groupProgram: any) => ({
        label: groupProgram.name,
        value: groupProgram.uuid
      }));
    }
  }

  public createAndEmit() {
    const payload = this.generatePayload();
    this._communityService
      .createGroup(payload)
      .subscribe((newGroup) => this.newGroup.emit(newGroup));
  }
  public onCancel() {
    this.hide.emit(true);
  }

  public onFacilityChanged(event) {
    this.facility = event;
    this.autoGenerateGroupNumber();
  }

  public onGroupActivityChanged(event) {
    this.groupActivity = event;
    this.showGroupActivity = true;
  }

  public onProgramChanged(event) {
    if (event.value === this.otzProgramUuid) {
      this.autoGenerateOTZGroupNumber();
      this.showGroupActivity = true;
    } else {
      this.autoGenerateGroupNumber();
      this.showGroupActivity = false;
    }
  }
}
