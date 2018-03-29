import { Component, OnInit, Input, OnChanges, EventEmitter } from '@angular/core';
import { Encounter } from '../../../models/encounter.model';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'visit-encounters-list',
    templateUrl : './visit-encounters-list.component.html',
    styleUrls : ['./visit-encounters-list.component.css']
})

export class VisitEncountersListComponent implements OnInit, OnChanges {

    public title: string = 'Patient Visits';
    public pretty: boolean;
    public mainArray: any = [];
    public visitsArray: any = [];
    public singleEncounterVisits: any = [];
    public reverseDateArray: any = [];
    public encountersArray: any = [];
    public reverseEncounterArray: any = [];
    public reverseVisitsArray: any = [];
    public encounterTypesArray: any = [];
    public encounterFilterTypeArray: any = [];
    public selectedEncounter: string = '';
    public displayArray: any = [];
    public onEncounterDetail: number;
    public dateDesc: boolean = false;
    public visitDesc: boolean = false;
    public orderEncounterArray: any = [];
    public ascIcon: string = 'fa fa-sort-alpha-asc fa-fw';
    public descIcon: string = 'fa fa-sort-alpha-desc fa-fw';
    public visitIcon: string = '';
    public locationOrderNo: number = 0;
    public locationIcon: string = '';
    public orderVisitNo: number = 0;
    public providerIcon: string = '';
    public providerOrderNo: number = 0;
    public dateOrderNo: number = 0;
    public dateIcon: string = this.ascIcon;
    public users: any[];
    public selectedEncounterType: any;
    public v: any;
    public busyIndicator: any = {
        busy: false,
        message: '...' // default message
    };

    @Input() public encounters: Encounter[];
    @Input() public showVisitsObservations: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute) { }

    public ngOnInit() {

        this.displayArray = this.mainArray;

    }

    public ngOnChanges() {
        this.busyIndicator = {
            busy: true,
            'message': 'Loading Encounters..'
        };
        if (this.encounters.length > 0) {
            this.groupEncountersByVisits(this.encounters);
        }

    }

    // get all users for display in visit provider

    public groupEncountersByVisits(encounters) {

        let visitsArray: any = [];

        encounters.forEach((encounter) => {

            let dateTime = encounter.encounterDatetime;

            // console.log('DateTime', dateTime);

            let visitDate = Moment(dateTime).format('YYYY-MM-DD');

            // console.log('encounter Time', encounterTime);

            let date = dateTime.substring(0, 10);

            let dateString = Moment(dateTime).format('YYMDD');

            let dateInt = parseInt(dateString, 0);

            let encounterTime = Moment(dateTime).format('HH:mm');

            // if encounter time is 00:00 then do not show

            if (encounterTime === '00:00') {

                encounterTime = '';

            }

            let time: string = dateTime.slice(-13, -5);

            let form = '';

            if (encounter.form !== null) {

                form = encounter.form.name;
            }

            let provider = '';

            if (encounter.encounterProviders !== null) {
                let encounterProvider = encounter.encounterProviders[0];
                if (typeof encounterProvider !== 'undefined') {

                    if (encounterProvider.provider !== null) {

                          if (encounterProvider.provider.display !== null) {

                            let displayMinusAttribute =
                            encounterProvider.provider.display.split('-')[2];

                            if (typeof displayMinusAttribute !== 'undefined') {

                                provider = encounterProvider.provider.display.split('-')[2];

                            }

                          }

                       }

                }

            }

            let encounterType = encounter.encounterType.display;

            let editLink = '';

            // console.log('Date Int' , dateInt);

            // console.log('Encounter' , encounter);

            let location =  encounter.location != null ? encounter.location.display : '';
            let createdBy = '';

            let visitType = '';

            if (encounter.visit !== null) {

                // console.log('Get Visit Type');

                let visitTypeTitle = encounter.visit.display;

                visitType = visitTypeTitle.split('VISIT')[0] + ' VISIT';

                createdBy = encounter.visit.auditInfo.creator.display;

            } else {
                visitType = '';
            }

            let visitObject = {
            [dateString]: {
                'type': 'parent',
                'date': visitDate,
                'time': '',
                'form': '',
                'encounterType': '',
                'location': location,
                'provider': createdBy,
                'visit': visitType,
                'encounter': '',
                'action': '',
                'encounterObj': '',
                'encounters': [],
                'show': true

            }
            };

            let encounterObj = {
                'type': 'encounter',
                'date': encounterTime,
                'encounterDatetime': dateTime,
                'time': '',
                'form': form,
                'encounterType': encounterType,
                'location': '',
                'provider': provider,
                'visit': '',
                'encounter': encounterType,
                'action': editLink,
                'encounterObj': encounter
            };

            let singleVisitEncounterObject = {
                'type': 'parent',
                'date': visitDate,
                'time': '',
                'form': '',
                'encounterType': '',
                'location': location,
                'provider': createdBy,
                'visit': visitType,
                'encounter': '',
                'action': '',
                'encounterObj': '',
                'encounters': [encounterObj],
                'show': true

            };

            if (typeof visitsArray[dateInt] === 'undefined') {

                visitsArray[dateInt] = visitObject;

            }

            visitsArray[dateInt][dateString].encounters.push(encounterObj);

            this.singleEncounterVisits.push(singleVisitEncounterObject);

            /* separate array with single encounter and visits entries
            for easier encounter sorting
            */

            // add encounter types to encounter type array
            this.encounterTypesArray.push(encounterType);

        });

        let compactedArray = _.compact(visitsArray);

        // filter to remove indexes given

        let finalArray = [];

        compactedArray.forEach((item, index) => {
            let key = Object.keys(item);
            let value = item[key[0]];

            finalArray.push(value);
            this.displayArray.push(value);

        });

        this.displayArray = this.sortByDateZa(finalArray);

        this.reverseDateArray = this.sortByDateAz(finalArray);

        this.mainArray = finalArray;

        this.sortPatientEncounterTypes();

        this.busyIndicator = {
            busy: false,
            'message': ''
        };

        return this.displayArray;

    }

    // create an array consisting only of the patient encounter types

    public sortPatientEncounterTypes() {

        let types = this.encounterTypesArray;

        let newTypes = _.uniq(types);

        this.encounterTypesArray = newTypes;

        // console.log('New Types', newTypes);

    }

    public onEncounterTypeChange(selectedEncounterType) {

        // check if item is in array

        let count = 0;

        this.encounterFilterTypeArray.forEach((element) => {
            if (element === selectedEncounterType) {
                count++;
            }
        });

        if (count === 0 && selectedEncounterType !== '') {
            this.encounterFilterTypeArray.push(selectedEncounterType);
        } else if (count === 0 && selectedEncounterType === '') {

            this.encounterFilterTypeArray = this.encounterTypesArray;

        } else {
            // if all is selected then add all the items in the encounter types array
            alert(selectedEncounterType);
            alert('Item is already in filter');
        }

        this.displayArray = this.displayArray;

    }

    public removeFilterItem(index) {
        return this.encounterFilterTypeArray.splice(index, 1);
    }

    public clearEncounterFilter() {
        return this.encounterFilterTypeArray = [];
    }

    public editEncounter(encounter) {
        if (encounter) {
            this.router.navigate(['../formentry', encounter.form.uuid], {
                relativeTo: this.route,
                queryParams: { encounter: encounter.uuid }
            });
        }
    }

    public showEncounterObservations(encounter) {
        if (encounter) {
            // console.log('Show Encounter ' , encounter);
            this.selectedEncounter = encounter;
            this.onEncounterDetail = Math.random();
            this.pretty = false;
        }

    }

    public showEncounterViewer(encounterObj) {
        if (encounterObj)  {
            this.selectedEncounter = encounterObj;
            this.onEncounterDetail = Math.random();
            this.pretty = true;
        }
    }

    public sortByProvider() {

        let providerOrderNo = this.providerOrderNo;

        if (providerOrderNo === 0) {
            // the encounters have not been ordered hence sort in asc

            let filteredForm =
                this.sortProviderAz(this.singleEncounterVisits);

            this.displayArray = filteredForm;

            this.providerIcon = this.ascIcon;

            this.providerOrderNo++;

        }

        if (providerOrderNo === 1) {
            // the encounters have not been ordered hence sort in asc

            let filteredForm =
                this.sortProviderZa(this.singleEncounterVisits);

            this.displayArray = filteredForm;

            this.providerIcon = this.descIcon;

            this.providerOrderNo++;

        }
        if (providerOrderNo === 2) {
            // the encounters have not been ordered hence sort in asc

            this.displayArray = this.mainArray;

            this.providerIcon = '';

            this.providerOrderNo = 0;

        }

    }

    public sortByVisits() {

        let visitOrderNo = this.orderVisitNo;

        if (visitOrderNo === 0) {
            // the encounters have not been ordered hence sort in asc

            let filteredVisit =
                this.sortByVisitsZa(this.displayArray);

            this.displayArray = filteredVisit;

            this.visitIcon = this.descIcon;

            this.orderVisitNo++;

        }

        if (visitOrderNo === 1) {
            // the encounters have not been ordered hence sort in asc

            let filteredVisit =
                this.sortByVisitsAz(this.displayArray);

            this.displayArray = filteredVisit;

            this.visitIcon = this.ascIcon;

            this.orderVisitNo++;

        }
        if (visitOrderNo === 2) {
            // the encounters have not been ordered hence sort in asc

            this.displayArray = this.mainArray;

            this.visitIcon = '';

            this.orderVisitNo = 0;

        }
    }

    public sortByLocation() {

        let locationOrderNo = this.locationOrderNo;

        if (locationOrderNo === 0) {
            // the encounters have not been ordered hence sort in asc

            let filteredLocation =
                this.sortByLocationsZa(this.displayArray);

            this.displayArray = filteredLocation;

            this.locationIcon = this.descIcon;

            this.locationOrderNo++;

        }

        if (locationOrderNo === 1) {
            // the encounters have not been ordered hence sort in asc

            let filteredLocation =
                this.sortByLocationsAz(this.displayArray);

            this.displayArray = filteredLocation;

            this.locationIcon = this.ascIcon;

            this.locationOrderNo++;

        }
        if (locationOrderNo === 2) {
            // the encounters have not been ordered hence sort in asc

            this.displayArray = this.mainArray;

            this.locationIcon = '';

            this.locationOrderNo = 0;

        }
    }
    public sortByDate() {

        let newDisplayArray = this.mainArray.slice().reverse();

        let dateDesc = this.dateDesc;

        if (dateDesc === true) {

            this.displayArray = this.mainArray;
            this.dateDesc = false;
            this.dateIcon = this.ascIcon;

        } else {

            this.displayArray = newDisplayArray;
            this.dateDesc = true;
            this.dateIcon = this.descIcon;
        }

    }

    public sortByDateZa(array) {

        array.sort((a: any, b: any) => {

            let dateA = Moment(a.date);
            let dateB = Moment(b.date);

            if (dateA < dateB) {
                return -1;
            } else if (dateA > dateB) {
                return 1;
            } else {
                return 0;
            }
        });

        return array;

    }

    public sortByDateAz(array) {

        array.sort((a: any, b: any) => {
            let dateA = Moment(a.date);
            let dateB = Moment(b.date);
            if (dateA < dateB) {
                return 1;
            } else if (dateA > dateB) {
                return -1;
            } else {
                return 0;
            }
        });

        return array;
    }

    public sortByVisitsAz(array) {

        array.sort((a: any, b: any) => {
            if (a.visit < b.visit) {
                return -1;
            } else if (a.visit > b.visit) {
                return 1;
            } else {
                return 0;
            }
        });

        return array;
    }

    public sortByVisitsZa(array) {

        array.sort((a: any, b: any) => {
            if (a.visit < b.visit) {
                return 1;
            } else if (a.visit > b.visit) {
                return -1;
            } else {
                return 0;
            }
        });

        return array;
    }

    public sortByLocationsAz(array) {

        array.sort((a: any, b: any) => {
            let locationA = parseInt(a.location.split('-')[1], 0);
            let locationB = parseInt(b.location.split('-')[1], 0);
            if (locationA < locationB) {
                return -1;
            } else if (locationA > locationB) {
                return 1;
            } else {
                return 0;
            }
        });

        return array;
    }

    public sortByLocationsZa(array) {

        array.sort((a: any, b: any) => {
            let locationA = parseInt(a.location.split('-')[1], 0);
            let locationB = parseInt(b.location.split('-')[1], 0);
            if (locationA < locationB) {
                return 1;
            } else if (locationA > locationB) {
                return -1;
            } else {
                return 0;
            }
        });

        return array;
    }

    public sortProviderAz(array) {

        array.sort((a: any, b: any) => {
            // console.log('a', a);
            if (a.encounters[0].provider < b.encounters[0].provider) {
                return -1;
            } else if (a.encounters[0].provider > b.encounters[0].provider) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;

    }

    public sortProviderZa(array) {

        array.sort((a: any, b: any) => {
            // console.log('a', a);
            if (a.encounters[0].provider < b.encounters[0].provider) {
                return 1;
            } else if (a.encounters[0].provider > b.encounters[0].provider) {
                return -1;
            } else {
                return 0;
            }
        });
        return array;

    }

}
