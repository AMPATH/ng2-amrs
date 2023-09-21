import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-ncd-report-dashboard-view',
  templateUrl: './ncd-report-dashboard-view.component.html',
  styleUrls: ['./ncd-report-dashboard-view.component.css']
})
export class NcdReportDashboardViewComponent implements OnInit, OnChanges {
  @Input() public plhivNcdData: any = null;
  @Input() public columnsDef: any;
  @Input() public reportDetails: any;
  @Output() public indicatorSelected = new EventEmitter();
  public patientGainAndLoseSummaryData: any;
  constructor() {}

  public ngOnInit(): void {
    console.log('columnsDef =>>', this.columnsDef);
    console.log('summaryData =>>', this.plhivNcdData);
    console.log('reportDetails =>>', this.reportDetails);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientGainAndLoseData) {
      this.patientGainAndLoseSummaryData =
        changes.patientGainAndLoseData.currentValue;
    }
  }
  public onIndicatorSelected(indicator: string, title: string) {
    const payload = {
      value: indicator,
      header: title,
      location: ''
    };
    this.indicatorSelected.emit(payload);
  }
}
