
import { take } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'hei-indicators-pdf-view',
  templateUrl: './hei-indicators-pdf-view.component.html',
  styleUrls: ['./hei-indicators-pdf-view.component.css']
})
export class HeiIndicatorsPdfViewComponent
  implements OnInit, OnChanges {

  @Input() heiMonthlySummary = [];
  @Input() params: any;
  @Input() sectionDefs: any;
  public heiSummaryColdef = [];
  public data = [];
  public reportData: any;
  public heisummaryGridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    groupDefaultExpanded : -1,
    onGridSizeChanged: () => {},
    onGridReady: () => {}
  };

  public locations = [];
  public displayTabluarFilters = true;
  public headers = [];
  public selectedResult = '';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.heiMonthlySummary) {
        this.processSummaryData(this.heiMonthlySummary);
    }
  }

  public processSummaryData(results) {
    this.data = results;
    this.setRowData(results);

  }

  public setRowData(results) {
      const sectionDefs = this.sectionDefs;
      _.each(results, (result: any) => {
          // console.log('result', result);
          this.locations.push(result.location);
          Object.keys(result).forEach((key, index) => {
          _.each(sectionDefs, (sectionDef: any) => {
               const indicators = sectionDef.indicators;
               _.each(indicators, (indicator: any) => {
                    const locationData = {
                      'location': result.location,
                      'location_uuid': result.location_uuid
                    };
                    locationData[indicator.indicator] = result[indicator.indicator];
                    if (indicator.indicator === key) {
                      if (indicator.hasOwnProperty('data') === false) {
                        indicator['data'] = [];
                      }
                      indicator['data'].push(locationData);
                    }
               });
          });
        });
      });

      this.reportData = sectionDefs;
  }



public viewPatientList(data, indicator) {
      const params: any = {
          locationUuids: data.location_uuid,
          indicators: indicator,
          startDate: this.params.startDate,
          endDate: this.params.endDate
      };
      this._router.navigate(['./patient-list']
          , {
              relativeTo: this._route,
              queryParams: params
          });
     }

  public downloadPdf() {

      const data = document.getElementById('contentToConvert');
      html2canvas(data).then(canvas => {
        // Few necessary setting options
        const imgWidth = 200;
        const pageHeight = 287;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('P', 'mm', 'a4'); // A4 size page of PDF
        let position = 15;
        pdf.setFontSize(20);
        pdf.text(10, 10, 'HEI Indicators Report');
        pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('HEI Report.pdf');
      });
    }


}

