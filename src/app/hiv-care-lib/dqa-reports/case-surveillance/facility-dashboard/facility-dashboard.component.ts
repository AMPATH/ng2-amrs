import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-facility-dashboard',
  templateUrl: './facility-dashboard.component.html',
  styleUrls: ['./facility-dashboard.component.css']
})
export class FacilityDashboardComponent implements OnInit, OnChanges {
  @Input() facilityName!: string;
  @Input() SummaryData = [];
  @Input() sectionDefs: any;
  @Input() reportDetails: any = [];

  @Output()
  public indicatorSelected = new EventEmitter();
  private _rowDefs: Array<any>;
  public test = [];
  public gridOptions: any = {
    columnDefs: []
  };
  public pdfvalue: any;
  public pdfSrc: string = null;
  public isBusy = false;
  public multipleLocations = false;
  public headers = [];
  public sectionIndicatorsValues: Array<any>;
  public pdfWidth = 1;
  public page = 1;
  public selectedResult: string;
  public selectedIndicatorsList = [];
  public errorFlag = false;
  public pdfMakeProxy: any = null;
  newCase = 0;
  linkedCase = 0;
  atRiskPbfw = 0;
  eligibleforVl = 0;
  hei6to8Weeks = 0;
  hei24Months = 0;
  heiWithoutFinalOutcome = 0;
  heiWithoutPcr = 0;
  prepLinked = 0;
  eligibleForVlNoOrder = 0;
  isLoadingCards = false;

  public cards: any[] = [];
  activeTab = 'realtime';
  title = 'Facility Dashboard';

  public startDate: string;
  public endDate: string;
  public locationUuids: string;

  @Output()
  public CellSelection = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.SummaryData && this.SummaryData) {
      this.isLoadingCards = true;

      // Wait for Angular to finish current change detection
      Promise.resolve().then(() => {
        this.updateCases();
        this.isLoadingCards = false;
      });
    }
  }

  private updateCases() {
    this.sectionIndicatorsValues = this.SummaryData;

    // 🔹 Extract sum of results instead of first element
    const extractValue = function (
      col: any,
      customKey?: string,
      fallback?: number
    ): number {
      fallback = fallback || 0;

      if (col && col.results && col.results.length > 0) {
        return col.results.reduce(function (sum, row) {
          const value = customKey ? row[customKey] : row.total;
          return sum + (value ? value : 0);
        }, 0);
      }

      return fallback;
    };

    // 🔹 Map indicators
    const indicatorConfig = [
      { key: 'atRiskPbfw', index: 0, custom: 'atRiskPbfwTotal' },
      { key: 'eligibleforVl', index: 1, custom: 'eligibleForVlTotal' },
      { key: 'hei6to8Weeks', index: 2, custom: 'hei6to8WeeksTotal' },
      { key: 'hei24Months', index: 3, custom: 'hei24MonthsTotal' },
      {
        key: 'heiWithoutFinalOutcome',
        index: 4,
        custom: 'heiWithoutFinalOutcomeTotal'
      },
      { key: 'heiWithoutPcr', index: 5, custom: 'heiWithoutPcrTotal' },
      { key: 'linkedCase', index: 6, custom: 'linkedCaseTotal' },
      { key: 'newCase', index: 7, custom: 'newCaseTotal' },
      { key: 'prepLinked', index: 8, custom: 'prepLinkedTotal' },
      {
        key: 'eligibleForVlNoOrder',
        index: 9,
        custom: 'eligibleForVlNoOrderAggregate'
      }
    ];

    // 🔹 Auto-assign values
    indicatorConfig.forEach((item) => {
      const column = this.sectionIndicatorsValues[item.index];
      this[item.key] = extractValue(column, item.custom);
    });

    // 🔹 Continue rendering
    this.updateCards();
    if (this.sectionDefs) {
      this.setColumns(this.sectionDefs);
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  private updateCards() {
    this.cards = [
      {
        title: 'HIV +ve not linked',
        numerator: [this.linkedCase, 'linkedCaseTotal'],
        denominator: [this.newCase, 'newCaseTotal'],
        percent:
          this.newCase !== 0
            ? ((this.linkedCase / this.newCase) * 100).toFixed(1)
            : 0,
        description: 'HIV Positive Clients not linked to ART'
      },
      {
        title: 'High risk -ve PBFW not on PrEP',
        numerator: [this.prepLinked, 'prepLinkedTotal'],
        denominator: [this.atRiskPbfw, 'atRiskPbfwTotal'],
        percent:
          this.atRiskPbfw !== 0
            ? ((this.prepLinked / this.atRiskPbfw) * 100).toFixed(1)
            : 0,
        description: 'High risk -ve PBFW Not linked to PrEP'
      },
      {
        title: 'Delayed enhanced adherence counselling',
        numerator: [0, ''],
        denominator: [0, ''],
        percent: 0,
        description: 'Virally unsuppressed clients without EAC within 2 weeks'
      },
      {
        title: 'Missed opportunity in viral load testing',
        numerator: [this.eligibleForVlNoOrder, 'eligibleForVlNoOrderTotal'],
        denominator: [this.eligibleforVl, 'eligibleForVlTotal'],
        percent:
          this.eligibleforVl !== 0
            ? ((this.eligibleForVlNoOrder / this.eligibleforVl) * 100).toFixed(
                1
              )
            : 0,
        description:
          'Number of clients on ART that visited the facility and were eligible for VL but no VL was done'
      },
      {
        title: 'HEI (6–8 weeks) without DNA-PCR Results',
        numerator: [this.heiWithoutPcr, 'heiWithoutPcrTotal'],
        denominator: [this.hei6to8Weeks, 'hei6to8WeeksTotal'],
        percent:
          this.hei6to8Weeks !== 0
            ? ((this.heiWithoutPcr / this.hei6to8Weeks) * 100).toFixed(1)
            : 0,
        description: 'HEI (6–8 WEEKS) without DNA PCR Results'
      },
      {
        title: 'Undocumented final outcome',
        numerator: [this.heiWithoutFinalOutcome, 'heiWithoutFinalOutcomeTotal'],
        denominator: [this.hei24Months, 'hei24MonthsTotal'],
        percent:
          this.hei24Months !== 0
            ? ((this.heiWithoutFinalOutcome / this.hei24Months) * 100).toFixed(
                1
              )
            : 0,
        description: '24 months old HEI without documented outcome'
      }
    ];
  }

  openPatientList(item: any, type: string) {
    const params = this.route.snapshot.queryParams;

    const startDate = params['startDate'];
    const endDate = params['endDate'];
    const indicators =
      type === 'numerator' ? item.numerator[1] : item.denominator[1];
    const locationUuids = params['locationUuids'];
    const indicatorName =
      item.title + ' - ' + (type === 'numerator' ? 'Numerator' : 'Denominator');

    this.router.navigate(['cs-report-patientlist'], {
      relativeTo: this.route,
      queryParams: {
        startDate,
        endDate,
        locationUuids,
        indicators,
        indicatorHeader: indicatorName
      }
    });
  }

  public setColumns(sectionsData: Array<any>) {
    this.headers = [];
    const defs = [];

    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];

      const created: any = {
        headerName: section.sectionTitle,
        children: []
      };

      this.headers.push({
        label: section.sectionTitle,
        value: i
      });

      // Loop indicators
      for (let j = 0; j < section.indicators.length; j++) {
        const indicator = section.indicators[j];

        // Normalize indicator into array of fields
        let fields: any[] = [];
        if (Array.isArray(indicator.indicator)) {
          fields = indicator.indicator;
        } else {
          fields = [indicator.indicator];
        }

        const child: any = {
          headerName: indicator.label,
          field: indicator.indicator,
          description: indicator.description,
          value: [],
          width: 360,
          total: 0
        };

        let sumOfValue = 0;
        const locations = [];

        // Loop values returned from query
        for (let k = 0; k < this.sectionIndicatorsValues.length; k++) {
          const element = this.sectionIndicatorsValues[k];

          const val: any = {
            location: element['location_uuid'],
            mfl_code: element['mfl_code'],
            county: element['county'],
            facility: element['facility'],
            value: []
          };

          // Multi-field indicator (ex: male/female OR ["total"])
          if (fields.length > 1) {
            for (let f = 0; f < fields.length; f++) {
              const fieldName = fields[f];
              const v = element[fieldName];

              if (v !== undefined && v !== null) {
                val.value.push(v);
                sumOfValue += v;
              } else {
                val.value.push('-');
              }
            }
          }

          // Single field indicator (ex: "location" or "total")
          if (fields.length === 1) {
            const fieldName = fields[0];
            const v = element[fieldName];

            if (v !== undefined && v !== null) {
              val.value.push(v);
              sumOfValue += v;
            } else {
              val.value.push('-');
            }
          }

          locations.push(element['location_uuid']);
          child.value.push(val);
        }

        // Assign totals
        child.total = {
          location: locations,
          value: sumOfValue
        };

        created.children.push(child);
      }

      defs.push(created);
    }

    this.gridOptions.columnDefs = defs;
  }

  public setCellSelection(col, val, arrayPosition, grid) {
    const arraypos = arrayPosition === 3 ? 0 : arrayPosition;
    const selectedIndicator = {
      headerName: col.headerName,
      field: col.field[arraypos],
      location: val.location
    };
    this.CellSelection.emit(selectedIndicator);
  }
  public searchIndicator() {
    this.setColumns(this.sectionDefs);
    if (this.selectedResult.length > 0) {
      this.gridOptions.columnDefs.forEach((object) => {
        const make = {
          headerName: '',
          children: []
        };
        object.children.forEach((object2) => {
          if (
            object2['headerName'].toLowerCase().match(this.selectedResult) !==
            null
          ) {
            make.headerName = object['headerName'];
            make.children.push(object2);
          }
        });
        if (make.headerName !== '') {
          this.test.push(make);
        }
      });
      this.gridOptions.columnDefs = [];
      this.gridOptions.columnDefs = this.test;
      this.test = [];
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
  public selectedIndicators() {
    this.setColumns(this.sectionDefs);
    const value = [];
    if (this.selectedIndicatorsList.length) {
      this.selectedIndicatorsList.forEach((indicator) => {
        value.push(this.gridOptions.columnDefs[indicator]);
      });
      this.gridOptions.columnDefs = value;
    } else {
      this.setColumns(this.sectionDefs);
    }
  }

  public bodyValues() {
    const body = [];
    // let span = 0;
    this.gridOptions.columnDefs.forEach((columnDefs) => {
      const head = [];
      const part = {
        text: columnDefs.headerName,
        style: 'tableHeader',
        fillColor: '#337ab7',
        colSpan: this.sectionIndicatorsValues.length + this.pdfWidth,
        alignment: 'left'
      };
      head.push(part);
      body.push(head);
      columnDefs.children.forEach((col) => {
        const sec = [];
        const test = {
          text: col.headerName,
          style: 'subheader',
          alignment: 'left'
        };
        sec.push(test);
        col.value.forEach((element) => {
          const value = {
            text: element.value,
            style: 'subheader',
            alignment: 'center'
          };
          sec.push(value);
        });
        if (this.multipleLocations) {
          sec.push({
            text: col.total.value,
            style: 'title',
            alignment: 'centre'
          });
        }
        body.push(sec);
      });
    });
    return body;
  }

  public nextPage(): void {
    this.page++;
  }
  public prevPage(): void {
    this.page--;
  }
}
