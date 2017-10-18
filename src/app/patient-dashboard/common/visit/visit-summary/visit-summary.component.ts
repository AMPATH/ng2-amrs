import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-visit-summary',
  templateUrl: './visit-summary.component.html',
  styleUrls: ['./visit-summary.component.css']
})
export class VisitSummaryComponent implements OnInit {

  @Output()
  public visitSummarySelected = new EventEmitter<any>();
  public visitSummaryDetails: any;
  private _visitSummary: Array<any> = [];
  @Input()
  public get visitSummary(): Array<any> {
    return this._visitSummary;
  }
  public set visitSummary(v: Array<any>) {
    this._visitSummary = v;
    this.setVisitSummary(v);

  }

  constructor() { }

  public ngOnInit() { }
  public setVisitSummary(data: Array<any>) {
    this.visitSummaryDetails = data;
  }
  public viewVisitDetails(visitDetails) {
    this.visitSummarySelected.emit(visitDetails);

  }

}
