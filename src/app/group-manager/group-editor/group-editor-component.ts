import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output ,
    EventEmitter } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../openmrs-api/user.service';
import { Subject } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { UserDefaultPropertiesService } from '../../user-default-properties';
@Component({
    selector: 'group-editor',
    templateUrl: './group-editor-component.html',
    styleUrls: ['./group-editor-component.css']
})
export class GroupEditorComponent implements OnInit, OnChanges {

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
    public editType: string;
    public groupPrograms: any = [];
    public groupProgram: any;
    public success = false;
    public message = '';
    public busy  = false;
    public providerLoading;
    public currentLoggedInProvider;
    public onSave: Subject<any> = new Subject();
    public onCreate: Subject<boolean> = new Subject();
    public groupNumberPattern = /\d{5}-\d{3}/;

    constructor(
                private _communityService: CommunityGroupService,
                private _providerResourceService: ProviderResourceService,
                private _locationSservice: LocationResourceService,
                public modalRef: BsModalRef,
                private userResourceService: UserService,
                private userLocationService: UserDefaultPropertiesService,
                private providerResourceService: ProviderResourceService) { }

    ngOnInit(): void {
        this.allFacilities();
        this.getCohortTypes();
        this.getCohortPrograms();
        this.fetchProviderOptions();
        if (this.editType.toLowerCase() === 'create') {
            this.getLoggedInProvider();
            this.getCurrentUserLocation();
        }
    }
    ngOnChanges(changes: SimpleChanges) {
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
            this.message = 'Pease ensure you have filled all the fields';
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
        const payLoad = {
            name : this.groupName,
            description: '',
            location: this.facility.value,
            startDate: Moment().format('YYYY-MM-DD'),
            cohortType: this.groupType.value,
            cohortProgram: this.groupProgram.value,
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

    public getCohortTypes() {

        this._communityService.getCohortTypes()
        .subscribe((results) => {
           this.groupTypes = results.map((groupType: any) => {
            return {
                 label : groupType.name,
                 value: groupType.uuid
             };
        });
        });

    }

    public getCohortPrograms() {

        this._communityService.getCohortPrograms()
        .subscribe((results) => {
           this.groupPrograms = results.map((groupProgram: any) => {
            return {
                 label : groupProgram.name,
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
            cohortType: this.groupType,
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

}
