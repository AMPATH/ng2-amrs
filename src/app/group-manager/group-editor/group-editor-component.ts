import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output ,
    EventEmitter } from '@angular/core';
import { CommunityGroupService } from '../../openmrs-api/community-group-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
@Component({
    selector: 'group-editor',
    templateUrl: './group-editor-component.html',
    styleUrls: ['./group-editor-component.css']
})
export class GroupEditorComponent implements OnInit, OnChanges {

    @Input() public provider: string;
    @Output() public hideDialog = new EventEmitter<boolean>();
    public selectedProviderUuid: string;
    public providers: any = [];
    public facilities: any = [];
    @Input() public groupNo: string;
    @Input() public groupUuid: string;
    @Input() public groupName: string;
    @Input() public facility: any;
    @Input() public address: string;
    @Input() public showGroupDialog = false;
    public groupTypes: any = [];
    @Input() public groupType: any;
    @Input() public editType: string;
    public groupPrograms: any = [];
    @Input() public groupProgram: any;
    public success = false;
    public message = '';
    public busy  = false;
    constructor(
                private _communityService: CommunityGroupService,
                private _providerResourceService: ProviderResourceService,
                private _locationSservice: LocationResourceService,
                private _router: Router,
                private _route: ActivatedRoute) { }

    ngOnInit(): void {
        this.allFacilities();
        this.getCohortTypes();
        this.getCohortPrograms();
        console.log('Load Group Editor');
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log('Chnages', changes);

    }

    public showCreateDolog() {
       this.showGroupDialog = true;
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

    public processProviders(providers) {

        const providersArray = [];
        _.each(providers, (provider: any) => {
           const providerPerson = provider.person;
           if (providerPerson !== null) {
             const specificProvider = {
                 'name': provider.display,
                 'uuid': provider.uuid
             };
             providersArray.push(specificProvider);
            }
        });
        this.providers = providersArray;
    }

    public selectFacility($event) {

    }

    public createUpdateGroup() {
        this.resetMessage();
        this.busy = true;
        const formValid = this.formValid();
        console.log('Edit  Type', this.editType);
        if (formValid) {

          if (this.editType === 'Edit') {
              this.updateCohort();
          }
          if (this.editType === 'Create') {
              this.createCohortGroup();
          }
        } else {
            this.success = false;
            this.message = 'Pease ensure you have filled all the fields';
            this.busy = false;
        }

    }
    public createCohortGroup() {
        console.log('create Cohort....');

        const payLoad = this.generatePayload();

        this._communityService.createCohort(payLoad)
            .subscribe((result) => {
                this.message = 'Cohort Group has been Succesfully Created';
                this.success = true;
                this.busy = false;
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
            attributes.push(  {
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
                value: this.provider
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

    public closeDialogue() {
        this.showGroupDialog = false;
        this.hideDialog.emit(false);
    }
}
