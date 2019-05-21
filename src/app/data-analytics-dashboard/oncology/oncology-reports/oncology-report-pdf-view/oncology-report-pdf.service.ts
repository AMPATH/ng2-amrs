import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators/take';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import * as Moment from 'moment';
declare let pdfMake: any;
declare let $: any;
import { first } from 'rxjs/operators';
import { VERSION } from 'src/environments/version';
import * as OncologyReportConfig from '../oncology-pdf-reports.json';

@Injectable({
  providedIn: 'root'
})
export class OncologyReportPdfService {
  public data: object = null;

  public constructor() { }

  public constructPdfStructure(data: Array<any>, params: any, title: String): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.getLogo('./assets/img/ampath.png', (letterHead) => {
        observer.next({
          pageSize: 'LETTER',
          pageMargins: 42,
          footer: {
            stack: [{
              bold: true,
              color: 'black',
              text: 'Generated On: ' + new Date(),
              style: { alignment: 'center', fontSize: 8 }
            }
            ],
            margin: [42, 20]
          },
          content: [{
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

  private formatDate(date: Date) {
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

      callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
  }

  public constructPdfSections(data: Array<any>, params: any): Array<Array<any>> {
    const sectionsArray: Array<Array<any>> = [[]];
    let section: Array<any> = [];
    data.forEach(element => {
      section = [
        {
          style: 'subheader',
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'Facility Name: ' +
                    element.location_name, style: 'headerStyle'
                },
                {
                  text: 'Date: ' + element.encounter_datetime,
                  style: 'headerStyle'
                }
              ]
            ]
          }
        },
        this.constructBodySection(element, params)
      ];
      sectionsArray.push(section);
    });

    return sectionsArray;
  }

  public constructBodySection(data: any, params: any): Array<Array<any>> {
    const tableSegment: Array<Array<any>> = [[]];

    _.each(this.getReportIndicators(params.type),
      (indicators) => {
        tableSegment.push(this.constructTableLayout(indicators, data));
      });

    _.remove(tableSegment, (arr) => {
      return arr.length === 0;
    });

    return tableSegment;

  }

  public constructTableLayout(indicator: any, data: any): Array<any> {
    const tableLayout: Array<any> = [
      {
        style: 'defaultTable',
        headerRows: 1,
        table: {
          widths: ['94%', '6%'],
          body: this.constructTableSection(indicator, data)
        }
      }
    ];

    return tableLayout;
  }

  public constructTableSection(indicator: any, data: any): Array<Array<any>> {
    const reportIndicators: Array<any> = indicator.report_indicators;
    const temp: Array<Array<any>> = [[]];
    let mappedData: Array<Array<any>> = Object.keys(data).map((key) => [key, data[key]]);
    mappedData = mappedData.filter(arr => reportIndicators.includes(arr[0]));
    _.forEach(mappedData, (arr) => {
      if (arr[0] === indicator.section) {
        temp.push([{ text: this.formatReportIndicators(arr[0]), style: 'headerstyle' },
        { text: arr[1], style: 'headerstyle' }]);
      } else {
        temp.push([this.formatReportIndicators(arr[0]), arr[1]]);
      }
    });

    _.remove(temp, (arr) => {
      return arr.length === 0;
    });
    return temp;
  }

  private getReportIndicators(type: String) {
    const report_config: Array<any> = OncologyReportConfig.reports;
    let sections: Array<any> = [];
    report_config.forEach((element) => {
      if (element.report_type === type) {
        sections = element.sections;
      }
    });
    return sections;
  }

  private _formatReportIndicators(indicator: String) {
    return indicator.replace('-', ' ')
      .replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  }


  public formatReportIndicators(indicator: String) {
    const word: String = indicator.replace(/_/g, ' ');
    return word.charAt(0).toUpperCase() + word.slice(1);
  }


  public generatePdf(data: Array<any>, params: any, title: String): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (data) {
        this.data = data;
        this.constructPdfStructure(data, params, title)
          .pipe(take(1)).subscribe(
            (pdfStructure) => {
              const pdfProxy = pdfMake.createPdf(pdfStructure);
              pdfProxy.getBase64((output) => {
                const int8Array: Uint8Array =
                  this.base64ToUint8Array(output);
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
}
