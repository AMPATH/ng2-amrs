import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

interface GridCol {
  headerName: string;
  width: number;
  field: string;
  hide?: boolean;
  children?: GridCol[];
}

@Component({
  selector: 'app-covid-19-tabular-view',
  templateUrl: './covid-19-tabular-view.component.html',
  styleUrls: ['./covid-19-tabular-view.component.css']
})
export class Covid19TabularViewComponent implements OnInit, OnChanges {
  @Input() public covid19SummaryData = [];
  @Input() public params = {
    endingMonth: ''
  };
  @Output() public indicatorSelected = new EventEmitter();
  @Input() public totalsRow = [];
  @Input() public covid19SectionDefs: any[];
  public covidSummaryColdef: GridCol[];
  public data = [];
  public gridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    groupDefaultExpanded: -1,
    onGridSizeChanged: () => {},
    onGridReady: () => {}
  };
  public reportTitle = 'Covid 19 Vaccination Report';
  public pinnedBottomRowData = [];
  public hideCols: string[] = ['person_id', 'location_uuid', 'location_id'];
  constructor() {}

  public ngOnInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.covid19SectionDefs) {
      if (changes.covid19SectionDefs.currentValue) {
        this.generateColdef(changes.covid19SectionDefs.currentValue);
      }
    }
  }

  public generateColdef(sectionDefs: any[]): void {
    const cols: GridCol[] = [];

    sectionDefs.forEach((section: any) => {
      cols.push({
        headerName: section.sectionTitle,
        field: section.sectionTitle,
        width: 200,
        children: section.indicators.map((i: any): GridCol => {
          return {
            headerName: i.label,
            field: i.indicator,
            width: 200
          };
        })
      });
    });

    this.covidSummaryColdef = cols;
  }
  public translateIndicator(indicator: string): string {
    return indicator
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  public onCellClicked($event: any): void {
    const indicators = $event.colDef.field;
    const title = this.translateIndicator(indicators);
    const location = $event.data.location_uuid;
    const payload = {
      indicators: indicators,
      header: title,
      locationUuids: location,
      endingMonth: this.params.endingMonth
    };
    this.indicatorSelected.emit(payload);
  }
  public hideCol(col: string): boolean {
    return this.hideCols.some((c: string) => {
      return c === col;
    });
  }
}
