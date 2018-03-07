import { Observable, Subject } from 'rxjs/Rx';
import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';
import * as Moment from 'moment';
declare let pdfMake: any;
declare let $: any;

export class HivPatientClinicalSummaryService {
  public static data: object = null;

  public static constructPdfStructure(): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      let data: any = this.data;
      let patient: Patient = data.patient;
      this._getLogo('./assets/img/ampath.png', (letterHead) => {
        observer.next({
          pageSize: 'LETTER',
          pageMargins: 42,
          footer: {
            stack: [{
              bold: true,
              color: 'red',
              text: 'Note: Confidentiality is one of the core duties of all' +
              ' medical practitioners.' +
              ' Patient\'s personal health information should be kept private.',
              style: ['quote', 'small']
            }, {
              bold: true,
              color: 'black',
              text: 'Generated Using: POC v' +
              this._getAppVersion() + ' | Generated On: ' + new Date(),
              style: ['quote', 'small']
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
                text: 'Ampath Clinical Summary',
                style: 'mainHeader',
                alignment: 'center'
              }, {
                columns: this._constructPatientDetails(patient)

              },
            ]
          }, {
            table: {
              widths: [535],
              body: HivPatientClinicalSummaryService._constructPatientDemographicsDetails(patient)
            }
          }, {
            style: 'tableExample',
            table: {
              widths: [535],
              body: [
                [{
                  stack: [

                    {
                      style: 'tableExample',

                      table: {
                        widths: [535],
                        headerRows: 1,
                        body: [
                          [{
                            text: 'HIV SUMMARY'
                          }],
                          [{

                            style: 'tableExample',
                            table: {
                              widths: [525],
                              body: this._constructPatientHivSummary(data.hivSummaries)
                            }
                          }]
                        ]
                      },
                      layout: 'headerLineOnly'
                    },
                    {
                      style: 'tableExample',

                      table: {
                        widths: [535],
                        headerRows: 1,
                        body: [
                          [{
                            text: 'PATIENT VITALS'
                          }],
                          [{
                            style: 'tableExample',
                            table: {
                              widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
                              body: this._constructPatientVitals(data.vitals)
                            }
                          }]
                        ]
                      },
                      layout: 'headerLineOnly'
                    },
                    {
                      style: 'tableExample',

                      table: {
                        widths: [535],
                        headerRows: 1,
                        body: [
                          [{
                            text: 'LAB TEST'
                          }],
                          [{
                            style: 'tableExample',
                            table: {
                              // widths: ['*', '*', '*', '*', '*'],
                              body: this._constructPatientLabTests(data.labDataSummary)
                            }
                          }]
                        ]
                      },
                      layout: 'headerLineOnly'
                    },
                    {
                      style: 'tableExample',

                      table: {
                        widths: [535],
                        headerRows: 1,
                        body: [
                          [{
                            text: 'REMINDERS'
                          }],
                          [{
                            style: 'tableExample',
                            table: {
                              widths: [525],
                              body: [
                                [
                                  {
                                    ul: this._constructPatientReminders(data.reminders)
                                  }
                                ]
                              ]
                            }
                          }]
                        ]
                      },
                      layout: 'headerLineOnly'
                    },
                    {
                      style: 'tableExample',

                      table: {
                        widths: [535],
                        headerRows: 1,
                        body: [
                          [{
                            text: 'CLINICAL NOTES'
                          }],
                          [{
                            style: 'tableExample',
                            table: {
                              widths: [525],
                              body: this._constructPatientClinicalNotes(data.notes)
                            }
                          }]
                        ]
                      },
                      layout: 'headerLineOnly'
                    },
                  ]
                }]
              ]
            }

          },

          ],
          styles: {
            header: {
              fontSize: 14,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            mainHeader: {
              fontSize: 14,
              bold: true,
              // color: 'blue',
              margin: [0, 0, 0, 0]
            },
            subheader: {
              fontSize: 12,
              bold: true,
              margin: [0, 10, 0, 5]
            },
            headerDetails: {
              fontSize: 10,
              bold: false,
              color: '#2a2a2a',
              margin: [0, 10, 0, 0]
            },
            tableExample: {
              margin: [0, 5, 0, 0]
            },
            sectionhead: {
              background: 'yellow',
              fontSize: 12,
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
            fontSize: 8
          }
        });
      });
    }).first();

  }

  private static _constructPatientDemographicsDetails(patient: Patient): Array<Array<any>> {
    let demographics: Array<Array<any>> = [['Patient has no demographics data']];
    try {
      if (patient.person !== {}) {
        demographics = [
          [{

            columns: [{
              columns: [{
                text: 'AMRS UID:',
                width: 43,
                bold: true,
              }, {
                text: patient.commonIdentifiers.ampathMrsUId || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'AMRS MRN:',
                width: 47,
                bold: true,
              }, {
                text: patient.commonIdentifiers.amrsMrn || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'CCC:',
                width: 20,
                bold: true,
              }, {
                text: patient.commonIdentifiers.cCC || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'National ID:',
                width: 47,
                bold: true,
              }, {
                text: patient.commonIdentifiers.kenyaNationalId || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }

            ]
          }],
          [{
            columns: [{
              columns: [{
                text: 'County:',
                width: 30,
                bold: true,
              }, {
                text: (patient.person.preferredAddress as any).address1 || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            },
              {
                columns: [{
                  text: 'Sub-County:',
                  width: 47,
                  bold: true,
                }, {
                  text: (patient.person.preferredAddress as any).address2 || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }
              ,
              {
                columns: [{
                  text: 'Estate:',
                  width: 27,
                  bold: true,
                }, {
                  text: (patient.person.preferredAddress as any).address3 || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
              }
              ,
              {
                columns: [{
                  text: 'Town/Village:',
                  width: 52,
                  bold: true,
                }, {
                  text: (patient.person.preferredAddress as any).cityVillage || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]

              }

            ]
          }]
        ]
        ;
      }
    } catch (e) {
    }
    return demographics;
  }

  private static _getProviders(providers: any): string {
    let p: string = '';
    _.each(providers, (provider: any) => {
      p = p + ' ' + provider.name + ' (' + provider.encounterType + '), ';
    });
    return p;
  }

  private static _formatDate(date: Date) {
    return Moment(date).format('DD-MM-YYYY');
  }

  private static _getAppVersion(): string {
    try {

      let json = require('../../../version.json');

      if (json && json.version) {
        return json.version.version + ' build: ' + new Date(json.version.buildDate);
      }

    } catch (e) {
      return '2';
    }
  }

  private static _constructPatientDetails(patient: Patient): Array<any> {
    let details: Array<any> = [['Patient has no demographics data']];
    try {
      details = [{
        text: patient.person.display || 'N/A',
        style: 'subheader',
        fillColor: '#dedede'
      }, {
        columns: [{
          text: 'Phone:',
          width: 45,
          style: 'subheader'
        }, {
          text: (patient.person.contacts as any).patientPhoneNumber || 'N/A',
          width: '*',
          style: 'headerDetails',
          alignment: 'left'
        }]
      }, {

        columns: [{
          text: 'Age:',
          width: 30,
          style: 'subheader'
        }, {
          text: (patient.person.age || 'N/A').toString(),
          width: 20,
          style: 'headerDetails',
          alignment: 'left'
        }, {
          text: 'DOB:',
          width: 30,
          style: 'subheader'
        }, {
          text: this._formatDate(patient.person.birthdate) || 'N/A',
          width: '*',
          style: 'headerDetails',
          alignment: 'left'
        }]
      }];

    } catch (e) {
    }
    return details;
  }

  private static _constructPatientHivSummary(hivSummaryData: Array<any>): Array<Array<any>> {
    let hivSummary: Array<Array<any>> = [['Patient has no Hiv Summary']];
    try {
      if (hivSummaryData.length > 0) {
        let patientHivSummary: any;
        let summary: any;
        for (summary of hivSummaryData){

            if (summary.is_clinical_encounter === 1) {

                patientHivSummary = summary;
                break;

            }

        }
        hivSummary = [
          [{
            columns: [{
              columns: [{
                text: 'Last Appt Date:',
                width: 60,
                bold: true,
              }, {
                text: this._formatDate(patientHivSummary.encounter_datetime) +
                ' (' + patientHivSummary.encounter_type_name + ')' || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'RTC Date:',
                width: 40,
                bold: true,
              }, {
                text: this._formatDate(patientHivSummary.rtc_date) || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Last Viral Load:',
                width: 60,
                bold: true,
              }, {
                text: (
                  patientHivSummary.vl_1 != null ?
                  this.transformZeroVl(patientHivSummary.vl_1) : 'N/A').toString() +
                ' (' + this._formatDate(patientHivSummary.vl_1_date) + ')' || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Last CD4 Count:',
                width: 60,
                bold: true,
              }, {
                text: (patientHivSummary.cd4_1 != null ?
                  patientHivSummary.cd4_1 : 'N/A').toString() +
                ' (' + this._formatDate(patientHivSummary.cd4_1_date) + ')' || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }

            ]
          }],
          [{
            columns: [{
              columns: [{
                text: 'Current ARV Regimen:',
                width: 50,
                bold: true,
              }, {
                text: patientHivSummary.cur_arv_meds || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'Enrollment Date:',
                width: 42,
                bold: true,
              }, {
                text: this._formatDate(patientHivSummary.enrollment_date) || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Current ARV Regimen Start Date',
                width: 60,
                bold: true,
              }, {
                text: this._formatDate(patientHivSummary.arv_start_date) || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'ARV Initiation Start Date',
                width: 60,
                bold: true,
              },
                {
                text: this._formatDate(patientHivSummary.arv_first_regimen_start_date ) || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Current Who Stage:',
                width: 48,
                bold: true,
              }, {
                text: (patientHivSummary.cur_who_stage || 'N/A').toString(),
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }

            ]
          }]
        ];
      }
    } catch (e) {
    }
    return hivSummary;
  }

  private static _constructPatientVitals(vitals: Array<any>): Array<Array<any>> {
    let patientVitals: Array<Array<any>> = [['Patient has no Vitals']];
    try {
      if (vitals.length > 0) {
        vitals = vitals.slice(0, 4);
        patientVitals = [
          [{
            text: 'Date',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'BP',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'Pulse',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'Temperature',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'Oxygen Sat',
            fontSize: 10,
            bold: true,
            width: '*',
          }, {
            text: 'Height',
            fontSize: 10,
            bold: true,
            width: '*',
          }, {
            text: 'Weight',
            fontSize: 10,
            bold: true,
            width: '*',
          }, {
            text: 'BMI',
            fontSize: 10,
            bold: true,
            width: '*',
          }

          ]
        ];
        _.each(vitals, (vital) => {
            patientVitals.push([
              this._formatDate(vital.encounter_datetime) || 'N/A',
              (vital.systolic_bp || '').toString() + '/' + (vital.diastolic_bp || '').toString(),
              (vital.pulse || '').toString(),
              (vital.temp || '').toString(),
              (vital.oxygen_sat || '').toString(),
              (vital.height || '').toString(),
              (vital.weight || '').toString(),
              (vital.BMI || '').toString(),
            ]);
          }
        )
        ;
      }
    } catch (e) {
    }
    return patientVitals;
  }

  private static _constructPatientLabTests(labTests: any): Array<Array<any>> {
    let patientLabTests: Array<Array<any>> = [['Patient has no Lab Test']];
    try {
      if (labTests.length > 0) {
        patientLabTests = [
          [{
            text: 'Lab Test Date',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'CD4 Count',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'CD4 Percent %',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'Viral Load',
            bold: true,
            fontSize: 10,
            width: '*',
          }, {
            text: 'ART',
            fontSize: 10,
            bold: true,
            width: '*',
          }

          ]
        ];
        _.each(labTests, (labs: any) => {
            if (labs.cd4_count != null || labs.cd4_percent != null || labs.hiv_viral_load != null) {
              patientLabTests.push([
                this._formatDate(labs.test_datetime) || 'N/A',
                (labs.cd4_count != null ? labs.cd4_count : '').toString(),
                (labs.cd4_percent != null ? labs.cd4_percent : '').toString(),
                (labs.hiv_viral_load != null ?
                  this.transformZeroVl(labs.hiv_viral_load) : '').toString(),
                (labs.cur_arv_meds != null ? labs.cur_arv_meds : '').toString()
              ]);
            }
          }
        )
        ;
        // patientLabTests = patientLabTests.slice(0, 5);
        if (patientLabTests.length < 2) {
          patientLabTests = [['Patient has no Lab Test']];
        }
      }
    } catch (e) {
    }
    return patientLabTests;
  }

  private static _constructPatientReminders(clinicalReminders: Array<any>): Array<Array<any>> {
    let patientReminders: Array<Array<any>> = [['Patient has no clinical reminders']];
    try {
      if (clinicalReminders.length > 0) {
        clinicalReminders = clinicalReminders.slice(0, 4); // get only the first 5
        patientReminders = [];
        _.each(clinicalReminders, (reminder) => {
            patientReminders.push([
              {
                columns: [{
                  text: reminder.title + ':',
                  width: 100,
                  bold: true,
                }, {
                  text: reminder.message,
                  width: '*',
                  // color: '#2a2a2a',
                  bold: true,
                }]
              }
            ]);
          }
        )
        ;
      }
    } catch (e) {
    }
    return patientReminders;
  }

  private static _constructPatientClinicalNotes(allNotes: any): Array<Array<any>> {
    let notes: Array<Array<any>> = [['Patient has no clinical notes ']];
    try {
      if (allNotes.length > 0) {
        let clinicalNotes: any = allNotes[0];
        notes = [
          [{
            columns: [{
              columns: [{
                text: 'Visit Date:',
                width: 60,
                bold: true,
              }, {
                text: (this._formatDate(clinicalNotes.visitDate) || 'N/A') +
                ' (' + (clinicalNotes.scheduled || 'N/A') + ')',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'Provider(s):',
                width: 42,
                bold: true,
              }, {
                text: this._getProviders(clinicalNotes.providers),
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Last Viral Load:',
                width: 60,
                bold: true,
              }, {
                text: (clinicalNotes.lastViralLoad.value != null ?
                  this.transformZeroVl(clinicalNotes.lastViralLoad.value) : 'N/A').toString()
                + ' (' + this._formatDate(clinicalNotes.lastViralLoad.date) + ')',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Last CD4 Count:',
                width: 60,
                bold: true,
              }, {
                text: (clinicalNotes.lastCD4Count.value != null ?
                  clinicalNotes.lastCD4Count.value : 'N/A').toString()
                + ' (' + this._formatDate(clinicalNotes.lastCD4Count.date) + ')',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }

            ]
          }],
          [{
            columns: [{
              columns: [{
                text: 'T:',
                width: 10,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.temperature || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'BP:',
                width: 15,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.bp || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'P:',
                width: 10,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.pulse || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'O2:',
                width: 15,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.oxygenSaturation || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'Ht:',
                width: 15,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.height || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'W:',
                width: 10,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.weight || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'BMI:',
                width: 20,
                bold: true,
              }, {
                text: (clinicalNotes.vitals.bmi || 'N/A').toString() || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }

            ]
          }],
          [{
            columns: [{
              columns: [{
                text: 'Dispensed ARV drugs:',
                width: 50,
                bold: true,
              }, {
                text: clinicalNotes.artRegimen.curArvMeds || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'TB Prophylaxis Plan:',
                width: 50,
                bold: true,
              }, {
                text: clinicalNotes.tbProphylaxisPlan.plan || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]

            }, {
              columns: [{
                text: 'TB Prophylaxis Start Date:',
                width: 50,
                bold: true,
              }, {
                text: clinicalNotes.tbProphylaxisPlan.startDate || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }, {
              columns: [{
                text: 'TB Prophylaxis End Date:',
                width: 50,
                bold: true,
              }, {
                text: clinicalNotes.tbProphylaxisPlan.estimatedEndDate || 'N/A',
                width: '*',
                alignment: 'left',
                color: '#2a2a2a',
              }]
            }

            ]
          }],
          [{
            columns: [{
              columns: [
                {
                  text: 'CC/HPI:',
                  width: 48,
                  bold: true,
                }, {
                  text: this._generateFreeText(clinicalNotes.ccHpi).toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
            }]
          }],
          [{
            columns: [{
              columns: [
                {
                  text: 'Assessment:',
                  width: 50,
                  bold: true,
                }, {
                  text: this._generateFreeText(clinicalNotes.assessment).toString() || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a',
                }]
            }]
          }],
          [{
            columns: [{
              text: 'RTC Date:',
              width: 48,
              bold: true,
            }, {
              text: this._formatDate(clinicalNotes.rtcDate) || 'N/A',
              width: '*',
              alignment: 'left',
              color: '#2a2a2a',
            }]
          }]
        ];
      }
    } catch (e) {
    }
    return notes;
  }

  private static _generateFreeText(notes: Array<any>): string {
    if (notes.length > 0) {
      return notes[0].value || 'N/A';
    } else {
      return 'None';
    }
  }

  private static _base64ToUint8Array(base64: any): Uint8Array {
    let raw = atob(base64);
    let uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  private static _getLogo(url: string, callback: any): void {
    let image: any = new Image();
    image.onload = function() {
      let canvas: any = document.createElement('canvas');
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

  private static transformZeroVl(vl) {

    if (vl === 0 || vl === '0') {
        return 'LDL';
    }else {
        return vl;
    }
 }

  public constructor(
  ) {
  }

  public generatePdf(data: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (data) {
        HivPatientClinicalSummaryService.data = data;
        HivPatientClinicalSummaryService.constructPdfStructure().subscribe(
          (pdfStructure) => {
            let pdfProxy = pdfMake.createPdf(pdfStructure);
            pdfProxy.getBase64((output) => {
              let int8Array: Uint8Array =
                HivPatientClinicalSummaryService._base64ToUint8Array(output);
              let blob = new Blob([int8Array], {
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
    }).first();

  }

}
