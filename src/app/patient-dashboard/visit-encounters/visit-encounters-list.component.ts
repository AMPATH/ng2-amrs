import { Ng2PaginationModule } from 'ng2-pagination';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, OnChanges, EventEmitter } from '@angular/core';
import { Encounter } from './../../models/encounter.model';
import { PatientEncounterService } from '../patient-encounters/patient-encounters.service';
import { EncounterResourceService } from './../../openmrs-api/encounter-resource.service';
import { VisitResourceService } from './../../openmrs-api/visit-resource.service';
import { VisitEncountersPipe } from './visit-encounters.pipe';
import { OrderByAlphabetPipe } from './visit-encounter.component.order.pipe';
import { EncounterTypeFilter } from
'./../patient-encounters/encounter-list.component.filterByEncounterType.pipe';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';


@Component({
    selector: 'visit-encounters-list',
    templateUrl : 'visit-encounters-list.component.html',
    styleUrls : ['visit-encounters-list.component.css']
})


export class VisitEncountersListComponent implements OnInit, OnChanges {

  title: string = 'Patient Visits';
  mainArray: any = [];
  visitsArray: any = [];
  singleEncounterVisits: any = [];
  reverseDateArray: any= [];
  encountersArray: any = [];
  reverseEncounterArray: any = [];
  reverseVisitsArray: any = [];
  encounterTypesArray: any = [];
  encounterFilterTypeArray: any = [];
  selectedEncounter: string = '';
  displayArray: any = [];
  onEncounterDetail: boolean = false;
  dateDesc: boolean = false;
  visitDesc: boolean = false;
  orderEncounterArray: any = [];
  ascIcon: string = 'fa fa-sort-alpha-asc fa-fw';
  descIcon: string = 'fa fa-sort-alpha-desc fa-fw';
  visitIcon: string = '';
  locationOrderNo: number = 0;
  locationIcon: string = '';
  orderVisitNo: number = 0;
  providerIcon: string = '';
  providerOrderNo: number = 0;
  dateOrderNo: number = 0;
  dateIcon: string = this.ascIcon;
  users: any [];


  @Input() encounters: Encounter[];
  @Input() showVisitsObservations: Boolean;


  constructor( private router: Router,
               private route: ActivatedRoute) { }

  ngOnInit() {

       this.displayArray = this.mainArray;


  }

  ngOnChanges() {
       if (this.encounters.length > 0 ) {
            this.groupEncountersByVisits(this.encounters);
       }

  }

  // get all users for display in visit provider




  groupEncountersByVisits(encounters) {

            let visitsArray: any = [];

            encounters.forEach(encounter => {


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


                    let time: string =  dateTime.slice(-13, -5);

                    let form = '';

                    if ( encounter.form !== null) {

                          form = encounter.form.name;
                    } else {

                    }

                     let provider = '';

                    if (encounter.provider !== null) {
                         provider = encounter.provider.display;
                    }

                    let encounterType = '';

                    if (encounter.encounterType.display !== null) {
                         encounterType = encounter.encounterType.display;
                    }

                    let location = '';

                    if (encounter.location !== null) {

                         location = encounter.location.display;
                    }




                    let editLink = '';

                    // console.log('Date Int' , dateInt);

                    // console.log('Encounter' , encounter);

                    let createdBy = '';


                    let visitType = '';

                    if (encounter.visit !== null) {

                        // console.log('Get Visit Type', encounter.visit);

                        let visitTypeTitle = encounter.visit.display;

                        visitType = visitTypeTitle.split('VISIT')[0] + ' VISIT';

                        createdBy = encounter.visit.auditInfo.creator.display;



                    }else {
                        visitType = '';
                    }


                    let visitObject = { [dateString] : {
                        'type': 'parent',
                        'date': visitDate,
                        'time': '',
                        'form': '',
                        'encounterType': '',
                        'location': location,
                        'provider' : createdBy,
                        'visit' : visitType,
                        'encounter': '',
                        'action': '',
                        'encounterObj' : '',
                        'encounters': [],
                        'show': true

                    }
                };

                 let encounterObj = {
                        'type': 'encounter',
                        'date': encounterTime,
                        'encounterDatetime': dateTime,
                        'time': '',
                        'form' : form,
                        'encounterType': encounterType,
                        'location' : '',
                        'provider' : provider,
                        'visit' : '',
                        'encounter' : encounterType,
                        'action' : editLink,
                        'encounterObj' : encounter
                    };

                     let singleVisitEncounterObject = {
                        'type': 'parent',
                        'date': visitDate,
                        'time': '',
                        'form': '',
                        'encounterType': '',
                        'location': location,
                        'provider' : createdBy,
                        'visit' : visitType,
                        'encounter': '',
                        'action': '',
                        'encounterObj' : '',
                        'encounters': [encounterObj],
                        'show': true

                    };

                    if (typeof  visitsArray[dateInt] === 'undefined') {

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

            compactedArray.forEach((item , index ) => {
                 let key = Object.keys(item);
                 let value = item[key[0]];

                  finalArray.push(value);
                  this.displayArray.push(value);

            });

            this.displayArray = this.sortByDateZa(finalArray);

            this.reverseDateArray = this.sortByDateAz(finalArray);

            this.mainArray = finalArray;

            this.sortPatientEncounterTypes();

            return this.displayArray;

}

  // create an array consisting only of the patient encounter types

  sortPatientEncounterTypes() {

      let types = this.encounterTypesArray;

      let newTypes = _.uniq(types);

      this.encounterTypesArray = newTypes;


      // console.log('New Types', newTypes);

  }

  onEncounterTypeChange(selectedEncounterType) {

      // check if item is in array

      let count = 0;

       this.encounterFilterTypeArray.forEach(element => {
             if ( element === selectedEncounterType) {
                  count++;
             }
       });

       if (count === 0  &&  selectedEncounterType !== '') {
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

  removeFilterItem(index) {
      return this.encounterFilterTypeArray.splice(index, 1);
  }

  clearEncounterFilter() {
      return this.encounterFilterTypeArray = [];
  }

 editEncounter(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }





  showEncounterObservations(encounter) {
    if (encounter) {
      // console.log('Show Encounter ' , encounter);
      this.selectedEncounter = encounter;
      this.onEncounterDetail = true;
    }

  }


    sortByProvider() {

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



  sortByVisits() {

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


  sortByLocation() {

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
  sortByDate() {

     let newDisplayArray = this.mainArray.slice().reverse();

     let dateDesc = this.dateDesc;


     if (dateDesc === true ) {

        this.displayArray = this.mainArray;
        this.dateDesc = false;
        this.dateIcon = this.ascIcon;

     } else {

        this.displayArray = newDisplayArray;
        this.dateDesc = true;
        this.dateIcon = this.descIcon;
     }


  }

  sortByDateZa(array) {

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

    sortByDateAz(array) {

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

  sortByVisitsAz(array) {

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

  sortByVisitsZa(array) {

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

    sortByLocationsAz(array) {

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

  sortByLocationsZa(array) {

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



    sortProviderAz(array) {

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

  sortProviderZa(array) {

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
