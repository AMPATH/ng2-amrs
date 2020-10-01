import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ClinicFlowCacheService {
  public lastClinicFlowSelectedDate: any;
  public dataIsLoading = true;
  public initialUuid;
  public data: any;
  public selectedLocations = new BehaviorSubject(this.initialUuid);
  public formatedDate = Moment(new Date()).format('YYYY-MM-DD');
  public selectedDate = new BehaviorSubject(this.formatedDate);
  public isLoading = new BehaviorSubject(this.dataIsLoading);
  public clinicFlowData = new BehaviorSubject(this.data);

  constructor() {}

  public setClinicFlowData(data: any) {
    this.initialUuid = data;
    this.clinicFlowData.next(data);
  }

  public getClinicFlowData() {
    return this.clinicFlowData;
  }

  public setSelectedLocation(locationUuids: any) {
    const locations: Array<string> = Array.isArray(locationUuids)
      ? locationUuids
      : locationUuids.split(',');
    this.setIsLoading(true);
    this.initialUuid = locations[0];
    this.selectedLocations.next(locations);
  }

  public getSelectedLocation() {
    return this.selectedLocations;
  }

  public setSelectedDate(date) {
    this.formatedDate = Moment(date).format('YYYY-MM-DD');
    this.lastClinicFlowSelectedDate = this.formatedDate;
    this.setIsLoading(true);
    this.selectedDate.next(this.formatedDate);
  }
  public getSelectedDate() {
    return this.selectedDate;
  }
  public setIsLoading(loading: boolean) {
    this.isLoading.next(loading);
  }
  public getIsLoading() {
    return this.isLoading;
  }
  public formatData(clinicFlowData) {
    const d: any = clinicFlowData || [];
    let count = 1;
    _.forEach(d, (row) => {
      row['#'] = count;
      if (!row['person_name']) {
        row['person_name'] = row['names'];
      }
      count++;
    });

    return clinicFlowData || [];
  }
  public getClinicFlowColumns() {
    return [
      {
        headerName: '#',
        field: '#',
        width: 60,
        filter: 'number',
        pinned: true
      },
      {
        headerName: 'Names',
        field: 'person_name',
        pinned: true,
        filter: 'text',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Registered',
        field: 'registered',
        filter: 'text',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        },
        cellRenderer: (params) => {
          let date = '';
          let time = '';
          if (params.value) {
            date = Moment(params.value).format('DD-MM-YYYY');
            time = Moment(params.value).format('H:mmA');
          }

          return (
            '<span class="text-warning" style="font-weight:bold;">' +
            time +
            '</span> </br>' +
            '<small>' +
            date +
            '</small>'
          );
        }
      },
      {
        headerName: 'Triaged',
        field: 'triaged',
        filter: 'text',
        width: 100,
        cellRenderer: (params) => {
          let date = '';
          let time = '';
          if (params.value) {
            date = Moment(params.value).format('DD-MM-YYYY');
            time = Moment(params.value).format('H:mmA');
          }

          return (
            '<span class="text-warning" style="font-weight:bold;">' +
            time +
            '</span> </br>' +
            '<small>' +
            date +
            '</small>'
          );
        }
      },
      {
        headerName: 'Triage Waiting Time (mins)',
        width: 210,
        filter: 'text',
        field: 'time_to_be_triaged'
      },
      {
        headerName: 'Seen by Clinician',
        field: 'seenByClinician',
        filter: 'text',
        width: 140,
        cellRenderer: (params) => {
          let encounterType = '';
          let date = '';
          let time = '';
          if (params.value.time && params.value.encounters) {
            date = Moment(params.value.time).format('DD-MM-YYYY');
            time = Moment(params.value.time).format('H:mmA');
            encounterType = params.value.encounters;
          }

          return (
            '<span class="text-warning" style="font-weight:bold;">' +
            time +
            '</span> </br>' +
            '<small>' +
            date +
            '</small>' +
            '</span> </br>' +
            encounterType
          );
        }
      },
      {
        headerName: 'Clinician Waiting Time (mins)',
        width: 210,
        filter: 'text',
        field: 'time_to_be_seen_by_clinician'
      },
      {
        headerName: 'Time to Complete Visit(mins)',
        width: 210,
        filter: 'text',
        field: 'time_to_complete_visit'
      },
      {
        headerName: 'Location',
        width: 100,
        filter: 'text',
        field: 'location',
        cellRenderer: (params) => {
          if (params.value === '-') {
            return '<i style="color:red" class="fa fa-minus-square-o" aria-hidden="true"></i>';
          } else {
            return params.value;
          }
        }
      }
    ];
  }
  public getLocationStatsColumn() {
    return [
      {
        headerName: 'Location',
        width: 120,
        filter: 'text',
        field: 'location',
        pinned: 'left'
      },
      {
        headerName: ' # Visits',
        width: 150,
        filter: 'text',
        field: 'totalVisitsCount'
      },
      {
        headerName: '# Incomplete',
        width: 180,
        filter: 'text',
        field: 'incompleteVisitsCount'
      },
      {
        headerName: 'Median Triage Waiting Time',
        width: 250,
        filter: 'text',
        field: 'medianWaitingTime.medianTriageWaitingTime'
      },
      {
        headerName: 'Median Clinician Waiting Time ',
        width: 250,
        filter: 'text',
        field: 'medianWaitingTime.medianClinicianWaitingTime'
      },
      {
        headerName: 'Median Visit Completion Time ',
        width: 250,
        filter: 'text',
        field: 'medianWaitingTime.medianVisitCompletionTime'
      }
    ];
  }
}
