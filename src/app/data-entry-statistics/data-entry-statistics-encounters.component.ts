import { Component,
    OnInit , OnDestroy , AfterViewInit, OnChanges ,
    Output , EventEmitter, Input , ChangeDetectorRef,
    ViewChild , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'data-entry-statistics-encounters',
  templateUrl: './data-entry-statistics-encounters.component.html',
  styleUrls: ['./data-entry-statistics-encounters.component.css']
})
export class DataEntryStatisticsEncountersComponent implements OnInit , OnChanges , AfterViewInit {

  public title: string = '';
  @Input() public dataEntryEncounterData: any = [];
  @Input() public params: any;
  @Output() public patientListParams: EventEmitter<any> = new EventEmitter();
  public dataEntryEncounters: any = [];
  public showCreatorsList: boolean = false;
  public showEncountersList: boolean = false;
  public showMontlyList: boolean = false;
  public showProviderList: boolean = false;
  public sizeColumns: boolean = true;

  public dataEntryEncounterColdef: any = [];

  constructor(
    private _cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
  }
  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges) {
       if (changes.dataEntryEncounterData
        && this.dataEntryEncounterData.length > 0) {
          this.processEncounterData(this.params);
       } else {
         this.dataEntryEncounters = [];
       }
  }

  public processEncounterData(params: any) {

     let viewType = params.subType;
     this.resetAllLists();

     switch (viewType) {

      case 'by-date-by-encounter-type':
        this.showEncountersList = true;
        this.title = 'Encounters per type per day';
        break;
      case 'by-month-by-encounter-type':
        this.showMontlyList = true;
        this.title = 'Encounters per type per Month';
        break;
      case 'by-provider-by-encounter-type':
        this.showProviderList = true;
        this.title = 'Encounters per type per Provider';
        break;
      case 'by-creator-by-encounter-type':
        this.showCreatorsList = true;
        this.title = 'Encounters per type per Creator';
        break;
      default:

     }

  }

  public resetAllLists() {
    this.showCreatorsList = false;
    this.showMontlyList = false;
    this.showProviderList = false;
    this.showEncountersList = false;

  }

  public getPatientListParams($event) {

    this.patientListParams.emit($event);

  }

}
