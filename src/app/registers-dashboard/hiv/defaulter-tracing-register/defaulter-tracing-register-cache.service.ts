import { Injectable } from '@angular/core';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DefaulterTracingRegisterCacheService {
  public lastdefaulterTracingRegisterSelectedDate: any;
  public dataIsLoading = true;
  public initialUuid;
  public data: any;
  public selectedLocations = new BehaviorSubject(this.initialUuid);
  public formatedDate = Moment(new Date()).format('YYYY-MM-DD');
  public selectedDate = new BehaviorSubject(this.formatedDate);
  public isLoading = new BehaviorSubject(this.dataIsLoading);
  public defaulterTracingRegisterData = new BehaviorSubject(this.data);

  constructor() {}

  public setdefaulterTracingRegisterData(data: any) {
    this.initialUuid = data;
    this.defaulterTracingRegisterData.next(data);
  }

  public getdefaulterTracingRegisterData() {
    return this.defaulterTracingRegisterData;
  }

  public setSelectedLocation(location: any) {
    this.setIsLoading(true);
    this.initialUuid = location.value;
    this.selectedLocations.next(location);
  }

  public getSelectedLocation() {
    return this.selectedLocations;
  }

  public setSelectedDate(date) {
    this.formatedDate = Moment(date).format('YYYY-MM-DD');
    this.lastdefaulterTracingRegisterSelectedDate = this.formatedDate;
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
  public formatData(defaulterTracingRegisterData) {
    const d: any = defaulterTracingRegisterData || [];
    let count = 1;
    _.forEach(d, (row) => {
      row['#'] = count;
      if (!row['person_name']) {
        row['person_name'] = row['names'];
      }
      count++;
    });

    return defaulterTracingRegisterData || [];
  }
  public getdefaulterTracingRegisterColumns() {
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
        field: 'seen_by_clinician_date',
        filter: 'text',
        width: 300,
        cellRenderer: (params) => {
          return `<span class="text-warning" style="font-weight:bold;">
            ${params.value}
            </span>`;
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
        width: 200,
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
