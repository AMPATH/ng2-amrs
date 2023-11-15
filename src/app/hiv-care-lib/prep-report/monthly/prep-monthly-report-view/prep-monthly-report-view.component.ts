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
  @Input() reportDetails: any;

  @Output()
  public indicatorSelected = new EventEmitter();

  public tableSectionIndicators = [];
  public tableSectionData: any[] = [];
  public headerMetaData = [];
  public ageGroups = [];
  public genderGroups = [];
  public tableData = [];

  constructor() {}

  ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    // reset variables
    this.tableSectionIndicators = [];
    this.tableSectionData = [];
    if (changes.SummaryData) {
      this.tableSectionIndicators = this.sectionDefs;
      this.tableSectionData = this.SummaryData;
      this.buildTableBody();
    }
  }

  public setOnCellClicked(whichCell) {
    const payload = {
      indicator: [...whichCell.indicators],
      indicatorHeader: whichCell.cell,
      month: this.reportDetails.month,
      locationUuids: this.reportDetails.locationUuids
    };
    this.indicatorSelected.emit(payload);
  }

  swapIndices(arr: any[]) {
    for (let i = 0; i < arr.length - 1; i += 2) {
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }
  }

  public buildTableBody() {
    this.tableSectionData = this.SummaryData;
    this.tableSectionIndicators = this.sectionDefs;

    this.resetTableVariables();

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

      // Find the first occurrence of 'F' in the original array
      const firstFIndex = this.genderGroups.indexOf('F');

      this.genderGroups = this.genderGroups
        .slice(firstFIndex)
        .concat(this.genderGroups.slice(0, firstFIndex));

      // Table data
      // Remove the first two sections
      const allData = this.tableSectionIndicators.slice(2);

      allData.forEach((section) => {
        this.tableData.push({
          sectionTitle: section.sectionTitle,
          sectionData: section.indicators.map((sect) => {
            this.swapIndices(sect.indicators);
            return {
              rowTitle: sect.label,
              rowData: sect.indicators.map((val) => {
                if (val.indicator.startsWith('total_')) {
                  return {
                    cell: val.label,
                    indicators: [val.indicator],
                    value: resultsMap.get(val.indicator) || 0
                  };
                } else {
                  return {
                    cell: val.label,
                    indicators: [val.indicator],
                    value: resultsMap.get(val.indicator) || 0
                  };
                }
              })
            };
          })
        });
      });
    }
  }

  private resetTableVariables() {
    this.headerMetaData = [];
    this.ageGroups = [];
    this.genderGroups = [];
    this.tableData = [];
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
