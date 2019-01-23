import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import * as Moment from 'moment';
require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');
declare let pdfMake: any;
declare let $: any;

export class MOHReportService {
    constructor() { }

    public generateMultiplePdfs(params: any, rows: Array<any>,
        sectionDefinitions: any): Observable<any> {

        return Observable.create((observer: Subject<any>) => {
            if (Array.isArray(rows) && rows.length > 0) {

                const pdfStructure = this.generatePdfReportObject(
                    params[0], rows[0], sectionDefinitions);
                for (let i = 1; i < rows.length; i++) {
                    const doc = this.generatePdfReportObject(
                        params[i], rows[i], sectionDefinitions);
                    pdfStructure.content[pdfStructure.content.length - 1].pageBreak = 'after';
                    pdfStructure.content = pdfStructure.content.concat(doc.content);
                }

                // JSON stringify and parse was done to handle a potential bug in pdfMake
                const p = JSON.stringify(pdfStructure);
                const x = JSON.parse(p);

                const pdfProxy = pdfMake.createPdf(x
                );
                pdfProxy.getBase64((output) => {
                    const int8Array: Uint8Array =
                        this._base64ToUint8Array(output);
                    const blob = new Blob([int8Array], {
                        type: 'application/pdf'
                    });
                    observer.next({
                        pdfSrc: URL.createObjectURL(blob),
                        pdfDefinition: pdfStructure,
                        pdfProxy: pdfProxy
                    });
                });

            } else {
                observer.error('some properties are missing');
            }
        }).pipe(first());

    }

    public generatePdf(params: any, rowData: any, sectionDefinitions: any): Observable<any> {

        return Observable.create((observer: Subject<any>) => {
            if (rowData) {
                const testP = [];
                const pdfStructure = this.generatePdfReportObject(
                    params, rowData, sectionDefinitions);

                // JSON stringify and parse was done to handle a potential bug in pdfMake
                const p = JSON.stringify(pdfStructure);
                const x = JSON.parse(p);

                const pdfProxy = pdfMake.createPdf(x
                );
                pdfProxy.getBase64((output) => {
                    const int8Array: Uint8Array =
                        this._base64ToUint8Array(output);
                    const blob = new Blob([int8Array], {
                        type: 'application/pdf'
                    });
                    observer.next({
                        pdfSrc: URL.createObjectURL(blob),
                        pdfDefinition: pdfStructure,
                        pdfProxy: pdfProxy
                    });
                });

            } else {
                observer.error('some properties are missing');
            }
        }).pipe(first());

    }

    public generatePdfReportObject(params: any, rowData: any, pdfReportSections: any) {

        const mainReportObject = this.generateReportHeaders(params);
        _.each(pdfReportSections, (section: any, sectionIndex) => {
            const sectionIndicatorLabels = [];
            const sectionIndicatorValues = [];
            _.each(section.indicators, (sectionIndicator: any, index) => {
                sectionIndicatorLabels.push([sectionIndicator.label]);
                let indicatorValue = '-';
                const indicatorDefinition = sectionIndicator.indicator;

                if (rowData[indicatorDefinition] || rowData[indicatorDefinition] === 0) {
                    indicatorValue = rowData[indicatorDefinition];
                }
                sectionIndicatorValues.push([sectionIndicator.ref, indicatorValue + '']);
            });

            const sectionData = {
                sectionHead: section.sectionTitle,
                sectionLabels: sectionIndicatorLabels,
                sectionDataValues: sectionIndicatorValues
            };

            const reportSection = this.generateReportSection(sectionData);
            mainReportObject.content.push(reportSection);

        });
        return mainReportObject;
    }

    private _base64ToUint8Array(base64: any): Uint8Array {
        const raw = atob(base64);
        const uint8Array = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    }

    private _getLogo(url: string, callback: any): void {
        const image: any = new Image();
        image.onload = function () {
            const canvas: any = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);

            // Get raw image data
            callback(canvas.toDataURL('image/png'));

            // ... or get as Data URI
            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }

    private generateReportHeaders(params): any {
        return {
            content: [
                {
                    text: params.facilityName.length < 150 ? params.facilityName :
                        params.facilityName.slice(0, 150) + '...',
                    style: 'header',
                    alignment: 'center'
                },
                {
                    stack: [
                        'National AIDS And STI Control Program', {
                            text: 'MOH-731 Comprehensive HIV/AIDS Facility Report Form',
                            style: 'subheader'
                        },
                    ],
                    style: 'subheader'
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: 'Facility:' + (params.facility.length < 150 ?
                                params.facility : params.facility.slice(0, 150) + '...')
                        }
                    ]
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: 'District:' + params.district
                        },
                        {
                            width: '*',
                            text: 'County:' + params.county
                        },
                        {
                            width: '*',
                            text: 'Start date: ' + params.startDate,
                            alignment: 'right'
                        },
                        {
                            width: '*',
                            text: 'End date: ' + params.endDate,
                            alignment: 'right'

                        }
                    ]
                },
                {

                }

            ],
            styles: {
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                sectionhead: {
                    // background: 'yellow',
                    fontSize: 12,
                    fillColor: '#8c8c8c',
                    bold: true,
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                //  alignment:'justify',
                fontSize: 10
            }

        };
    }

    private generateReportSection(sectionData): any {
        return {
            style: 'tableExample',
            table: {
                widths: ['*'],
                body: [
                    [
                        [{
                            table: {
                                widths: ['*'],
                                body: [
                                    [{
                                        text: sectionData.sectionHead,
                                        style: 'sectionhead'
                                    }]
                                ]
                            }
                        }]
                    ],
                    [
                        {
                            // layout: 'noBorders',
                            table: {
                                widths: [310, 10, 10, '*'],
                                body: [
                                    [{
                                        table: {
                                            widths: ['*'],
                                            body: sectionData.sectionLabels
                                        }
                                    }, {
                                        text: ''
                                    }, {
                                        text: ''
                                    },
                                    [{
                                        table: {
                                            widths: [50, '*'],
                                            body: sectionData.sectionDataValues
                                        },
                                    }]
                                    ]
                                ]
                            }
                        }
                    ]

                ]
            }
        };

    }

}
