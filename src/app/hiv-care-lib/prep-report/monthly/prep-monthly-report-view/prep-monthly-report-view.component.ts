import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-prep-monthly-report-view',
  templateUrl: './prep-monthly-report-view.component.html',
  styleUrls: ['./prep-monthly-report-view.component.css']
})
export class PrepMonthlyReportViewComponent implements OnInit, OnChanges {
  @Input() SummaryData = [];
  @Input() sectionDefs: any;
  @Input() reportDetails: any = [];

  @Output()
  public indicatorSelected = new EventEmitter();

  public tableSectionIndicators = [];
  public tableSectionData = [];
  public headerMetaData = [];
  public ageGroups = [];
  public genderGroups = [];
  public tableData = [];

  @Output()
  public CellSelection = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.SummaryData) {
      this.tableSectionIndicators = this.sectionDefs;
      this.tableSectionData = this.SummaryData;
      this.buildTableBody();
    }
  }

  public setCellSelection(col) {
    this.CellSelection.emit({ cell: col });
  }

  public buildTableBody() {
    this.tableSectionData = this.SummaryData;
    this.tableSectionIndicators = this.sectionDefs;
    console.log('tableSectionIndicators', this.tableSectionIndicators);

    const resultsMap = this.mapPrepMonthlyReportResults();

    if (
      this.tableSectionIndicators.length > 0 &&
      this.tableSectionData.length > 0
    ) {
      this.tableSectionIndicators[0].indicators.forEach((indicator) => {
        this.headerMetaData.push({
          label: indicator.label,
          value: resultsMap.get(indicator.indicator)
        });
      });

      // Age distribution
      this.tableSectionIndicators[1].indicators[0].indicators.forEach(
        (indicator) => {
          this.ageGroups.push(indicator);
        }
      );

      // Gender distribution
      this.tableSectionIndicators[1].indicators[1].indicators.forEach(
        (indicator) => {
          this.genderGroups.push(indicator);
        }
      );

      // Table data
      // Remove the first two sections
      const allData = this.tableSectionIndicators.slice(2);

      allData.forEach((section) => {
        this.tableData.push({
          sectionTitle: section.sectionTitle,
          sectionData: section.indicators.map((sect) => {
            return {
              rowTitle: sect.label,
              rowData: sect.indicator.map((val) => {
                return {
                  cell: val,
                  value: resultsMap.get(val)
                };
              })
            };
          })
        });
      });
    }
  }

  private mapPrepMonthlyReportResults() {
    return this.tableSectionData.reduce((map, result) => {
      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          map.set(key, result[key]);
        }
      }
      return map;
    }, new Map());
  }
}
