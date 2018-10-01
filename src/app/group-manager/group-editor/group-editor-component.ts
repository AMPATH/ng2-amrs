import { Component, OnInit, Output , EventEmitter } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { BsModalRef } from 'ngx-bootstrap';
import { UserService } from '../../openmrs-api/user.service';
import { Subject } from 'rxjs';
import { UserDefaultPropertiesService } from '../../user-default-properties';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { CommunityGroupAttributeService } from '../../openmrs-api/community-group-attribute-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';

const DEFAULT_GROUP_TYPE = 'community_group';
const HIV_DIFFERENTIATED_CARE_PROGRAM = {'label': 'HIV DIFFERENTIATED CARE PROGRAM', 'value': '334c9e98-173f-4454-a8ce-f80b20b7fdf0'};
@Component({
    selector: 'group-editor',
    templateUrl: './group-editor-component.html',
    styleUrls: ['./group-editor-component.css']
})

export class GroupEditorComponent implements OnInit {

    public provider: any;
    public selectedProviderUuid: string;
    public providers: any = [];
    public facilities: any = [];
    public groupNo: string;
    public groupUuid: string;
    public groupName: string;
    public facility: any;
    public address: string;
    public showGroupDialog = false;
    public groupTypes: any = [];
    public groupType: any;
    public editType = 'create';
    public groupPrograms: any = [];
    public groupProgram: any;
    public success = false;
    public message = '';
    public busy  = false;
    public providerLoading;
    public currentLoggedInProvider;
    public onSave: Subject<any> = new Subject();
    public onCreate: Subject<boolean> = new Subject();
    public groupNumberPattern = /\d{5}-\d{5}/;
    public groupNamePattern = /[a-zA-Z]+/;
    public isModal = false;
    public groupNoErrorMessage = '';
    public allGroupNumbers = [];
    @Output() newGroup: EventEmitter<any> = new EventEmitter<any>();
    @Output() hide: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
                private _communityService: CommunityGroupService,
                private _providerResourceService: ProviderResourceService,
                private _locationSservice: LocationResourceService,
                public modalRef: BsModalRef,
                private _communityAttributeService: CommunityGroupAttributeService,
                private userResourceService: UserService,
                private userLocationService: UserDefaultPropertiesService,
                private providerResourceService: ProviderResourceService,
                private programResourceService: ProgramResourceService) { }

    ngOnInit(): void {
        this.allFacilities();
        this.getCohortPrograms();
        this.fetchProviderOptions();
        if (this.editType.toLowerCase() === 'create') {
            this.getLoggedInProvider();
            this.getCurrentUserLocation();
            this.setDefaultProgram();
        }
        this.fetchAllGroupNumbers();
    }

    public fetchAllGroupNumbers() {
        this._communityAttributeService.getAttributesByAttributeType('groupNumber')
        .subscribe((attributes) => {
            _.forEach(attributes, (attribute) => {
                this.allGroupNumbers.push(attribute.value);
            });
        });
    }

    public allFacilities() {

        this._locationSservice.getLocations()
        .subscribe((result: any) => {
            this.facilities = result.map((location: any) => {
                return {
                     label : location.display,
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
        if (providerSearchTerm.length === 0 ) {
             this.selectedProviderUuid = '';
         }
     }


    public selectFacility($event) {

    }

    public checkGroupNumber(enteredGroupNumber) {
        this.groupNo = enteredGroupNumber;
        const check = _.filter(this.allGroupNumbers, (groupNumber) => this.groupNo === groupNumber);
        if (this.editType.toLowerCase() === 'create') {
            check.length > 0 ? this.groupNoErrorMessage = 'Group Number Already Exists!' : this.groupNoErrorMessage = '';
        } else {
            check.length > 1 ? this.groupNoErrorMessage = 'Group Number Already Exists!' : this.groupNoErrorMessage = '';
        }
    }

    public createUpdateGroup() {
        this.resetMessage();
        this.busy = true;
        const formValid = this.formValid();
        if (formValid) {

          if (this.editType.toLowerCase() === 'edit') {
              this.updateCohort();
          }
          if (this.editType.toLowerCase() === 'create') {
              this.createCohortGroup();
          }
        } else {
            this.success = false;
            this.message = 'Please ensure you have filled all the fields';
            this.busy = false;
        }

    }
    public createCohortGroup() {
        const payLoad = this.generatePayload();
        if (this.formValid()) {
            this.onCreate.next(true);
        }
        this._communityService.createGroup(payLoad)
            .subscribe((result) => {
                this.modalRef.hide();
                setTimeout(() => {
                    this.onSave.next(result);
                }, 2500);
            },
            (error) => {
                this.message = 'Error creating cohort group, kindly try again';
                this.success = false;
                this.busy = false;
                this.onCreate.next(false);
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
            attributes.push(  {
                cohortAttributeType: 'landmark',
                value: this.address
            });
        }
        if (this.provider !== '') {
            attributes.push(  {
                cohortAttributeType: 'provider',
                value: this.provider['value']
            });
        }
        if (this.groupProgram !== '') {
            attributes.push( {
                cohortAttributeType: 'programUuid',
                value: this.groupProgram['value']
            });
        }
        const payLoad = {
            name : this.groupName,
            description: '',
            location: this.facility.value,
            startDate: Moment().format('YYYY-MM-DD'),
            cohortType: DEFAULT_GROUP_TYPE,
            groupCohort: true,
            attributes : attributes
        };
        return payLoad;
    }

    public updateCohort() {
        const payLoad = this.generatePayload();
        this._communityService.updateCohortGroup(payLoad, this.groupUuid)
        .subscribe((results) => {
            this.message = 'Cohort Group has been Succesfully Updated';
            this.success = true;
            this.busy = false;
            this.onSave.next(results);

        },
        (error) => {
            this.message = 'Error updating cohort group, kindly try again';
            this.success = false;
            this.busy = false;
        });

    }


    public getCohortPrograms() {

        this.programResourceService.getPrograms()
        .subscribe((results) => {
           this.groupPrograms = results.map((groupProgram: any) => {
            return {
                 label : groupProgram.display,
                 value: groupProgram.uuid
             };
        });
        });

    }

    public selectGroupType($event) {

    }
    public selectGroupProgram($event) {
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
        this.address = '';
        this.provider = '';
        this.success = false;
        this.message = '';
        this.groupName = '';
    }
    public formValid() {
        const payLoad = {
            name : this.groupName,
            description: '',
            location: this.facility,
            cohortType: DEFAULT_GROUP_TYPE,
            cohortProgram: this.groupProgram,
            groupNo: this.groupNo
        };
       if (payLoad.name === '' || !payLoad.location
        || !payLoad.cohortType || !payLoad.cohortProgram ||
        payLoad.groupNo === '') {
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
         const findProvider = this.providerResourceService.searchProvider(term, false);
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
            const filteredProviders = _.filter(providers, (p: any) => !_.isNil(p.person));
            this.providers = filteredProviders.map((provider) => {
                return {
                    label: provider.person.display,
                    value: provider.uuid
                };
            });
          }

    public getLoggedInProvider() {
        const providerPersonUuid = this.userResourceService.getLoggedInUser().personUuid;
        this.providerResourceService.getProviderByPersonUuid(providerPersonUuid)
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
            this.facility = { label: location.display, value: location.uuid};
        }

    }

    public setDefaultProgram() {
        this.groupProgram = HIV_DIFFERENTIATED_CARE_PROGRAM;
    }
    public createAndEmit() {
      const payload = this.generatePayload();
      this._communityService.createGroup(payload).subscribe((newGroup) =>
      this.newGroup.emit(newGroup));
    }
    public onCancel() {
      this.hide.emit(true);
    }
}
