import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators/take';
import { Observable, Subject, of } from 'rxjs';
import { first } from 'rxjs/operators';

import * as _ from 'lodash';
import * as Moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { VERSION } from 'src/environments/version';
import * as OncologyReportConfig from '../oncology-pdf-reports.json';

@Injectable({
  providedIn: 'root'
})
export class OncologyReportPdfService {
  public data: object = null;

  public constructor() {}

  public constructPdfStructure(
    data: Array<any>,
    params: any,
    title: String
  ): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.getLogo('./assets/img/ampath.png', (letterHead) => {
        observer.next({
          pageSize: 'LETTER',
          pageMargins: 42,
          footer: {
            stack: [
              {
                bold: true,
                color: 'black',
                text: ' Generated On: ' + new Date(),
                style: { alignment: 'center', fontSize: 8 }
              }
            ],
            margin: [42, 20]
          },
          content: [
            {
              stack: [
                {
                  image: letterHead,
                  width: 150,
                  alignment: 'center'
                },

                {
                  text: this._formatReportIndicators(title) + ' Report',
                  style: 'mainHeader',
                  alignment: 'center'
                }
              ]
            },
            this.constructPdfSections(data, params)
          ],
          styles: {
            header: {
              fontSize: 14,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            mainHeader: {
              fontSize: 18,
              bold: true,
              margin: [0, 10, 0, 10]
            },
            subheader: {
              fontSize: 10,
              bold: true,
              fillColor: '#979799',
              margin: [0, 10, 0, 0]
            },
            headerstyle: {
              fontSize: 10,
              bold: true,
              color: '#2a2a2a',
              fillColor: '#d3d3d3'
            },
            defaultTable: {
              fontSize: 10,
              margin: [0, 0, 0, 5]
            },
            tableHeader: {
              bold: true,
              fontSize: 10,
              color: 'black'
            },
            columns: {
              fontSize: 11,
              margin: [5, 2, 10, 20]
            },
            indicatorTitle: {
              fontSize: 12,
              bold: true,
              margin: [0, 5, 0, 5]
            }
          },
          defaultStyle: {
            fontSize: 8
          }
        });
      });
    }).pipe(first());
  }

  public constructAggregatePdfStructure(
    data: Array<any>,
    params: any,
    title: String
  ): Observable<any> {
    const aggregatedData = this.aggregateData(data, params);
    this.constructAggregateOuterLayout(data, params);
    return Observable.create((observer: Subject<any>) => {
      this.getLogo('./assets/img/ampath.png', (letterHead) => {
        observer.next({
          pageSize: 'LETTER',
          pageMargins: 42,
          footer: {
            stack: [
              {
                bold: true,
                color: 'black',
                text: ' Generated On: ' + new Date(),
                style: { alignment: 'center', fontSize: 8 }
              }
            ],
            margin: [42, 20]
          },
          content: [
            {
              stack: [
                {
                  image: letterHead,
                  width: 150,
                  alignment: 'center'
                },
                {
                  text: aggregatedData.locations,
                  margin: [0, 5, 0, 5],
                  alignment: 'center',
                  style: 'locationStyle'
                },
                {
                  text:
                    this._formatReportIndicators(title) + ' Aggregate Report',
                  style: 'header',
                  alignment: 'center'
                },
                {
                  columns: [
                    {
                      width: '*',
                      style: 'dateColumn',
                      text: 'Start Date: ' + params.startDate
                    },
                    {
                      width: '*',
                      style: 'dateColumn',
                      text: 'End Date: ' + params.endDate
                    }
                  ],
                  bold: true,
                  color: '#2a2a2a',
                  fillColor: '#d3d3d3'
                },
                aggregatedData.sections[0].body
              ]
            },
            {
              layout: 'noBorders',
              table: {
                widths: ['*', '*'],
                body: this.constructAggregateOuterLayout(data, params)
              }
            }
          ],
          styles: {
            header: {
              fontSize: 14,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            locationStyle: {
              fontSize: 12,
              bold: true,
              margin: [0, 10, 0, 5]
            },
            dateColumn: {
              alignment: 'center',
              fontSize: 10,
              bold: true
            },
            defaultTable: {
              fontSize: 8,
              margin: [0, 10, 0, 5]
            },
            headerstyle: {
              fontSize: 8,
              bold: true,
              color: '#2a2a2a',
              fillColor: '#d3d3d3'
            },
            aggTable: {
              fontSize: 8,
              margin: [0, 10, 0, 5]
            }
          },
          defaultStyle: {
            fontSize: 8
          }
        });
      });
    }).pipe(first());
  }

  public constructPdfSections(
    data: Array<any>,
    params: any
  ): Array<Array<any>> {
    const sectionsArray: Array<Array<any>> = [[]];
    let section: Array<any> = [];
    data.forEach((rowSection) => {
      section = [
        {
          style: 'subheader',
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'Facility Name: ' + rowSection.location_name,
                  style: 'headerStyle'
                },
                {
                  text: 'Date: ' + rowSection.encounter_datetime,
                  style: 'headerStyle'
                }
              ]
            ]
          }
        },
        this.constructBodySection(rowSection, params, 'pdf')
      ];
      sectionsArray.push(section);
    });

    return sectionsArray;
  }

  public constructAggregateOuterLayout(
    data: Array<any>,
    params: any
  ): Array<Array<Array<any>>> {
    const sectionsArray: Array<Array<Array<any>>> = [[[]]];
    const aggregatedData = this.aggregateData(data, params);
    aggregatedData.sections.shift();

    const left_temp: Array<Array<any>> = [[]];
    const right_temp: Array<Array<any>> = [[]];
    aggregatedData.sections.forEach((section) => {
      section[0].body.forEach((left_arr) => {
        left_temp.push(left_arr);
      });
      section[1].body.forEach((right_arr) => {
        right_temp.push(right_arr);
      });
    });
    left_temp.shift();
    right_temp.shift();
    sectionsArray.push([left_temp, right_temp]);

    sectionsArray.shift();
    return sectionsArray;
  }

  private styleAggregateTable(data: Array<Array<any>>) {
    return [
      {
        style: 'defaultTable',
        table: {
          widths: ['92%', '8%'],
          body: data
        }
      }
    ];
  }

  public constructTableSection(indicator: any, data: any): Array<Array<any>> {
    const reportIndicators: Array<any> = indicator.report_indicators;
    const temp: Array<Array<any>> = [[]];
    let mappedData: Array<Array<any>> = Object.keys(data).map((key) => [
      key,
      data[key]
    ]);
    mappedData = mappedData.filter((reportIndicator) =>
      reportIndicators.includes(reportIndicator[0])
    );
    _.forEach(mappedData, (reportIndicator) => {
      if (reportIndicator[0] === indicator.section) {
        temp.push([
          {
            text: this.formatReportIndicators(reportIndicator[0]),
            style: 'headerstyle'
          },
          { text: reportIndicator[1], style: 'headerstyle' }
        ]);
      } else {
        temp.push([
          this.formatReportIndicators(reportIndicator[0]),
          reportIndicator[1]
        ]);
      }
    });

    _.remove(temp, (report) => {
      return report.length === 0;
    });
    return temp;
  }

  public constructTableLayout(indicator: any, data: any): Array<any> {
    return [
      {
        style: 'defaultTable',
        headerRows: 1,
        table: {
          widths: ['94%', '6%'],
          body: this.constructTableSection(indicator, data)
        }
      }
    ];
  }

  public constructBodySection(
    data: any,
    params: any,
    reportType: String
  ): Array<Array<any>> {
    const tableSegment: Array<Array<any>> = [[]];
    const reportIndicators = this.getReportIndicators(params.type);
    _.each(reportIndicators, (indicators) => {
      tableSegment.push(this.constructTableLayout(indicators, data));
    });

    _.remove(tableSegment, (segment) => {
      return segment.length === 0;
    });

    return tableSegment;
  }

  public getReportIndicators(type: String) {
    const report_config: Array<any> = OncologyReportConfig.reports;
    let sections: Array<any> = [];
    report_config.forEach((report) => {
      if (report.report_type === type) {
        sections = report.sections;
      }
    });

    return sections;
  }

  private _formatReportIndicators(indicator: String) {
    return indicator
      .replace('-', ' ')
      .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
  }

  public formatReportIndicators(indicator: String) {
    const word: String = indicator.replace(/_/g, ' ');
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  public aggregateData(data: Array<any>, params: any) {
    const report_config: Array<any> = OncologyReportConfig.reports;
    let sections: Array<any> = [];
    const pdfBody: any = {};
    pdfBody.locations = _.join(_.uniq(_.map(data, 'location_name')), ', ');
    report_config.forEach((config: any) => {
      if (config.report_type === params.type) {
        sections = config.sections;
      }
    });

    _.forEach(sections, (section) => {
      section.total = _.sumBy(data, section.section);
      if (section.section.match(/%/)) {
        section.total = (parseFloat(section.total) / data.length).toFixed(2);
      }
      const reportIndicators: Array<any> = section.report_indicators;
      const tempStorage: Array<Array<any>> = [[]];
      const mappedData = this.mapDataByIndicator(data, reportIndicators);

      _.forEach(mappedData, (sectionData) => {
        if (sectionData[0] === section.section) {
          tempStorage.push([
            {
              text: this.formatReportIndicators(sectionData[0]),
              style: 'headerstyle'
            },
            { text: sectionData[1], style: 'headerstyle' }
          ]);
        } else {
          tempStorage.push([
            this.formatReportIndicators(sectionData[0]),
            sectionData[1]
          ]);
        }
      });

      _.remove(tempStorage, (reportIndicator) => {
        return reportIndicator.length === 0;
      });
      section.body = this.styleAggregateTable(tempStorage);
    });

    pdfBody.sections = _.concat(sections[0], _.chunk(_.slice(sections, 1), 2));

    return pdfBody;
  }

  private mapDataByIndicator(data, indicators): any[] {
    const DataHolder = {};
    _.each(data, (_data) => {
      _.each(indicators, (indicator) => {
        DataHolder[indicator] = _.sumBy(data, indicator);
      });
    });
    const DataStructHolder = [];
    _.each(DataHolder, (value: any, prop) => {
      if (prop.match(/%/)) {
        value = (parseFloat(value) / data.length).toFixed(2);
      }
      DataStructHolder.push([prop, value]);
    });
    return DataStructHolder;
  }

  public generatePdf(
    data: Array<any>,
    params: any,
    title: String
  ): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (data) {
        this.data = data;
        this.constructPdfStructure(data, params, title)
          .pipe(take(1))
          .subscribe(
            (pdfStructure) => {
              const pdfProxy = pdfMake.createPdf(pdfStructure);
              pdfProxy.getBase64((output) => {
                const int8Array: Uint8Array = this.base64ToUint8Array(output);
                const blob = new Blob([int8Array], {
                  type: 'application/pdf'
                });
                observer.next({
                  pdfSrc: URL.createObjectURL(blob),
                  pdfDefinition: pdfStructure,
                  pdfProxy: pdfProxy
                });
              });
            },
            (err) => {
              console.error(err);
            }
          );
      } else {
        observer.error('some properties are missing');
      }
    }).pipe(first());
  }

  public generateAggregatePdf(
    data: Array<any>,
    params: any,
    title: String
  ): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (data) {
        this.data = data;
        this.constructAggregatePdfStructure(data, params, title)
          .pipe(take(1))
          .subscribe(
            (pdfStructure) => {
              const pdfProxy = pdfMake.createPdf(pdfStructure);
              pdfProxy.getBase64((output) => {
                const int8Array: Uint8Array = this.base64ToUint8Array(output);
                const blob = new Blob([int8Array], {
                  type: 'application/pdf'
                });
                observer.next({
                  pdfSrc: URL.createObjectURL(blob),
                  pdfDefinition: pdfStructure,
                  pdfProxy: pdfProxy
                });
              });
            },
            (err) => {
              console.error(err);
            }
          );
      } else {
        observer.error('some properties are missing');
      }
    }).pipe(first());
  }

  private _formatDate(date: Date) {
    return _.isNull(date) ? 'None' : Moment(date).format('DD-MM-YYYY');
  }

  private getAppVersion(): string {
    try {
      return VERSION.version + VERSION.hash;
    } catch (e) {
      return '2';
    }
  }

  private base64ToUint8Array(base64: any): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  private getLogo(url: string, callback: any): void {
    const image: any = new Image();
    image.onload = function () {
      const canvas: any = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;

      canvas.getContext('2d').drawImage(this, 0, 0);

      callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
  }
}
