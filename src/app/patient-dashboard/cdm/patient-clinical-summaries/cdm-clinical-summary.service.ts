import { take } from 'rxjs/operators/take';
import { Observable, Subject } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';
import * as Moment from 'moment';
declare let pdfMake: any;
declare let $: any;
import { VERSION } from '../../../../environments/version';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CdmClinicalSummaryService {
  public static data: object = null;

  public static constructPdfStructure(): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      const data: any = this.data;
      const patient: Patient = data.patient;
      this._getLogo('./assets/img/ampath.png', (letterHead) => {
        observer.next({
          pageSize: 'LETTER',
          pageMargins: 42,
          footer: {
            stack: [
              {
                bold: true,
                color: 'red',
                text:
                  'Note: Confidentiality is one of the core duties of all' +
                  ' medical practitioners.' +
                  " Patient's personal health information should be kept private.",
                style: ['quote', 'small']
              },
              {
                bold: true,
                color: 'black',
                text:
                  'Generated Using: POC v' +
                  this._getAppVersion() +
                  ' | Generated On: ' +
                  new Date(),
                style: ['quote', 'small']
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
                  text: 'Ampath Clinical Summary',
                  style: 'mainHeader',
                  alignment: 'center'
                },
                {
                  columns: this._constructPatientDetails(patient)
                }
              ]
            },
            {
              table: {
                widths: [535],
                body: CdmClinicalSummaryService._constructPatientDemographicsDetails(
                  patient
                )
              }
            },
            {
              style: 'tableExample',
              table: {
                widths: [535],
                body: [
                  [
                    {
                      stack: [
                        {
                          style: 'tableExample',

                          table: {
                            widths: [535],
                            headerRows: 1,
                            body: [
                              [
                                {
                                  text: 'CDM SUMMARY'
                                }
                              ],
                              [
                                {
                                  style: 'tableExample',
                                  table: {
                                    widths: [525],
                                    body: this._constructPatientCdmSummary(data)
                                  }
                                }
                              ]
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
                              [
                                {
                                  text: 'PATIENT VITALS'
                                }
                              ],
                              [
                                {
                                  style: 'tableExample',
                                  table: {
                                    widths: [
                                      '*',
                                      '*',
                                      '*',
                                      '*',
                                      '*',
                                      '*',
                                      '*',
                                      '*'
                                    ],
                                    body: this._constructPatientVitals(data)
                                  }
                                }
                              ]
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
                              [
                                {
                                  text: 'LAB TEST'
                                }
                              ],
                              [
                                {
                                  style: 'tableExample',
                                  table: {
                                    widths: ['*', '*', '*', '*', '*'],
                                    body: this._constructPatientLabTests(data)
                                  }
                                }
                              ]
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
                              [
                                {
                                  text: 'REMINDERS'
                                }
                              ],
                              [
                                {
                                  style: 'tableExample',
                                  table: {
                                    widths: [525],
                                    body: [
                                      [
                                        {
                                          ul: this._constructPatientReminders(
                                            data.reminders
                                          )
                                        }
                                      ]
                                    ]
                                  }
                                }
                              ]
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
                              [
                                {
                                  text: 'CLINICAL NOTES'
                                }
                              ],
                              [
                                {
                                  style: 'tableExample',
                                  table: {
                                    widths: [525],
                                    body: this._constructPatientClinicalNotes(
                                      data.notes,
                                      data.summaryEndDate,
                                      data.summaryStartDate
                                    )
                                  }
                                }
                              ]
                            ]
                          },
                          layout: 'headerLineOnly'
                        }
                      ]
                    }
                  ]
                ]
              }
            }
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
              bold: true
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
    }).pipe(first());
  }

  private static _constructPatientDemographicsDetails(
    patient: Patient
  ): Array<Array<any>> {
    let demographics: Array<Array<any>> = [
      ['Patient has no demographics data']
    ];
    try {
      if (!_.isEmpty(patient.person)) {
        demographics = [
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'AMRS UID:',
                      width: 43,
                      bold: true
                    },
                    {
                      text: patient.commonIdentifiers.ampathMrsUId || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'AMRS MRN:',
                      width: 47,
                      bold: true
                    },
                    {
                      text: patient.commonIdentifiers.amrsMrn || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'CCC:',
                      width: 20,
                      bold: true
                    },
                    {
                      text: patient.commonIdentifiers.cCC || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'National ID:',
                      width: 47,
                      bold: true
                    },
                    {
                      text: patient.commonIdentifiers.kenyaNationalId || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'County:',
                      width: 30,
                      bold: true
                    },
                    {
                      text:
                        (patient.person.preferredAddress as any).address1 ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Sub-County:',
                      width: 47,
                      bold: true
                    },
                    {
                      text:
                        (patient.person.preferredAddress as any).address2 ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Estate:',
                      width: 27,
                      bold: true
                    },
                    {
                      text:
                        (patient.person.preferredAddress as any).address3 ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Town/Village:',
                      width: 52,
                      bold: true
                    },
                    {
                      text:
                        (patient.person.preferredAddress as any).cityVillage ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ]
        ];
      }
    } catch (e) {}
    return demographics;
  }

  private static _getProviders(providers: any): string {
    let p = '';
    _.each(providers, (provider: any) => {
      p = p + provider.name + ' (' + provider.encounterType + '), ';
    });
    return p;
  }

  private static _formatDate(date: Date) {
    if (date == null) {
      return 'None';
    }
    return Moment(date).format('DD-MM-YYYY');
  }

  private static _getAppVersion(): string {
    try {
      return VERSION.version + VERSION.hash;
    } catch (e) {
      return '2';
    }
  }

  private static _constructPatientDetails(patient: Patient): Array<any> {
    let details: Array<any> = [['Patient has no demographics data']];
    try {
      details = [
        {
          text: patient.person.display || 'N/A',
          style: 'subheader',
          fillColor: '#dedede'
        },
        {
          columns: [
            {
              text: 'Phone:',
              width: 45,
              style: 'subheader'
            },
            {
              text:
                (patient.person.contacts as any).patientPhoneNumber || 'N/A',
              width: '*',
              style: 'headerDetails',
              alignment: 'left'
            }
          ]
        },
        {
          columns: [
            {
              text: 'Age:',
              width: 30,
              style: 'subheader'
            },
            {
              text: (patient.person.age || 'N/A').toString(),
              width: 20,
              style: 'headerDetails',
              alignment: 'left'
            },
            {
              text: 'DOB:',
              width: 30,
              style: 'subheader'
            },
            {
              text: this._formatDate(patient.person.birthdate) || 'N/A',
              width: '*',
              style: 'headerDetails',
              alignment: 'left'
            }
          ]
        }
      ];
    } catch (e) {}
    return details;
  }

  private static _constructPatientCdmSummary(
    cdmSummaryData: Array<any>
  ): Array<Array<any>> {
    let cdmSummary: Array<Array<any>> = [['Patient has no Cdm Summary']];
    try {
      if (cdmSummaryData.length > 0) {
        let patientCdmSummary: any;
        let summary: any;
        for (summary of cdmSummaryData) {
          if (summary.is_clinical_encounter === 1) {
            patientCdmSummary = summary;
            break;
          }
        }
        cdmSummary = [
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'Last Appt Date:',
                      width: 60,
                      bold: true
                    },
                    {
                      text:
                        this._formatDate(patientCdmSummary.encounter_datetime) +
                          ' (' +
                          patientCdmSummary.encounter_type +
                          ')' || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'RTC Date:',
                      width: 40,
                      bold: true
                    },
                    {
                      text:
                        this._formatDate(patientCdmSummary.rtc_date) || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'LMP:',
                      width: 40,
                      bold: true
                    },
                    {
                      text: this._formatDate(patientCdmSummary.lmp) || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ]
        ];
      }
    } catch (e) {}
    return cdmSummary;
  }

  private static _constructPatientVitals(
    vitals: Array<any>
  ): Array<Array<any>> {
    let patientVitals: Array<Array<any>> = [['Patient has no Vitals']];
    try {
      if (vitals.length > 0) {
        vitals = vitals.slice(0, 4);
        patientVitals = [
          [
            {
              text: 'Date',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'BP',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'Pulse',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'Temperature',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'Oxygen Sat',
              fontSize: 10,
              bold: true,
              width: '*'
            },
            {
              text: 'Height',
              fontSize: 10,
              bold: true,
              width: '*'
            },
            {
              text: 'Weight',
              fontSize: 10,
              bold: true,
              width: '*'
            },
            {
              text: 'BMI',
              fontSize: 10,
              bold: true,
              width: '*'
            }
          ]
        ];
        _.each(vitals, (vital) => {
          patientVitals.push([
            this._formatDate(vital.encounter_datetime) || 'N/A',
            (vital.sbp || '').toString() + '/' + (vital.dbp || '').toString(),
            (vital.pulse || '').toString(),
            (vital.temp || '').toString(),
            (vital.oxygen_sat || '').toString(),
            (vital.height || '').toString(),
            (vital.weight || '').toString(),
            (vital.BMI || '').toString()
          ]);
        });
      }
    } catch (e) {}
    return patientVitals;
  }

  private static _constructPatientLabTests(labTests: any): Array<Array<any>> {
    let patientLabTests: Array<Array<any>> = [['Patient has no Lab Test']];
    try {
      if (labTests.length > 0) {
        patientLabTests = [
          [
            {
              text: 'Lab Test Date',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'RBS',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'FBS',
              bold: true,
              fontSize: 10,
              width: '*'
            },
            {
              text: 'HbA1c',
              bold: true,
              fontSize: 10,
              width: '*'
            }
          ]
        ];
        _.each(labTests, (labs: any) => {
          if (labs.rbs != null || labs.fbs != null || labs.hb_a1c != null) {
            patientLabTests.push([
              this._formatDate(labs.encounter_datetime) || 'N/A',
              (labs.rbs != null ? labs.rbs : '').toString(),
              (labs.fbs != null ? labs.fbs : '').toString(),
              (labs.hb_a1c != null ? labs.hb_a1c : '').toString()
            ]);
          }
        });
        // patientLabTests = patientLabTests.slice(0, 5);
        if (patientLabTests.length < 2) {
          patientLabTests = [['Patient has no Lab Test']];
        }
      }
    } catch (e) {}
    return patientLabTests;
  }

  private static _constructPatientReminders(
    clinicalReminders: Array<any>
  ): Array<Array<any>> {
    let patientReminders: Array<Array<any>> = [
      ['Patient has no clinical reminders']
    ];
    try {
      if (clinicalReminders.length > 0) {
        clinicalReminders = clinicalReminders.slice(0, 4); // get only the first 5
        patientReminders = [];
        _.each(clinicalReminders, (reminder) => {
          patientReminders.push([
            {
              columns: [
                {
                  text: reminder.title + ':',
                  width: 100,
                  bold: true
                },
                {
                  text: reminder.message,
                  width: '*',
                  // color: '#2a2a2a',
                  bold: true
                }
              ]
            }
          ]);
        });
      }
    } catch (e) {}
    return patientReminders;
  }

  private static _constructPatientClinicalNotes(
    allNotes: any,
    startDate: any,
    endDate: any
  ): Array<Array<any>> {
    let notes: Array<Array<any>> = [['Patient has no clinical notes ']];
    try {
      if (allNotes.length > 0) {
        const clinicalNotes: any = allNotes[0];
        const sDate: any = startDate;
        const eDate: any = endDate;
        notes = [
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'Visit Date:',
                      width: 42,
                      bold: true
                    },
                    {
                      text:
                        (this._formatDate(clinicalNotes.visitDate) || 'N/A') +
                        ' (' +
                        (clinicalNotes.scheduled || 'N/A') +
                        ')',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Last Viral Load:',
                      width: 60,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.lastViralLoad.value != null
                          ? this.transformZeroVl(
                              clinicalNotes.lastViralLoad.value
                            )
                          : 'N/A'
                        ).toString() +
                        ' (' +
                        this._formatDate(clinicalNotes.lastViralLoad.date) +
                        ')',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Last CD4 Count:',
                      width: 60,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.lastCD4Count.value != null
                          ? clinicalNotes.lastCD4Count.value
                          : 'N/A'
                        ).toString() +
                        ' (' +
                        this._formatDate(clinicalNotes.lastCD4Count.date) +
                        ')',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: 'Provider(s): ',
                  width: 42,
                  bold: true
                },
                {
                  text: this._getProviders(clinicalNotes.providers),
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a'
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'T:',
                      width: 10,
                      bold: true
                    },
                    {
                      text:
                        (
                          clinicalNotes.vitals.temperature || 'N/A'
                        ).toString() || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'BP:',
                      width: 15,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.vitals.bp || 'N/A').toString() || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'P:',
                      width: 10,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.vitals.pulse || 'N/A').toString() ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'O2:',
                      width: 15,
                      bold: true
                    },
                    {
                      text:
                        (
                          clinicalNotes.vitals.oxygenSaturation || 'N/A'
                        ).toString() || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Ht:',
                      width: 15,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.vitals.height || 'N/A').toString() ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'W:',
                      width: 10,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.vitals.weight || 'N/A').toString() ||
                        'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'BMI:',
                      width: 20,
                      bold: true
                    },
                    {
                      text:
                        (clinicalNotes.vitals.bmi || 'N/A').toString() || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'Dispensed ARV drugs:',
                      width: 50,
                      bold: true
                    },
                    {
                      text: clinicalNotes.artRegimen.curArvMeds || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'TB Prophylaxis Plan:',
                      width: 50,
                      bold: true
                    },
                    {
                      text: clinicalNotes.tbProphylaxisPlan.plan || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'TB Prophylaxis Start Date:',
                      width: 50,
                      bold: true
                    },
                    {
                      text: this._formatDate(sDate) || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'TB Prophylaxis End Date:',
                      width: 50,
                      bold: true
                    },
                    {
                      text: this._formatDate(eDate) || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'CC/HPI:',
                      width: 48,
                      bold: true
                    },
                    {
                      text:
                        this._generateFreeText(
                          clinicalNotes.ccHpi
                        ).toString() || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  columns: [
                    {
                      text: 'Assessment:',
                      width: 50,
                      bold: true
                    },
                    {
                      text:
                        this._generateFreeText(
                          clinicalNotes.assessment
                        ).toString() || 'N/A',
                      width: '*',
                      alignment: 'left',
                      color: '#2a2a2a'
                    }
                  ]
                }
              ]
            }
          ],
          [
            {
              columns: [
                {
                  text: 'RTC Date:',
                  width: 48,
                  bold: true
                },
                {
                  text: this._formatDate(clinicalNotes.rtcDate) || 'N/A',
                  width: '*',
                  alignment: 'left',
                  color: '#2a2a2a'
                }
              ]
            }
          ]
        ];
      }
    } catch (e) {}
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
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  private static _getLogo(url: string, callback: any): void {
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

  private static transformZeroVl(vl) {
    if (vl === 0 || vl === '0') {
      return 'LDL';
    } else {
      return vl;
    }
  }

  public constructor() {}

  public generatePdf(data: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (data) {
        CdmClinicalSummaryService.data = data;
        CdmClinicalSummaryService.constructPdfStructure()
          .pipe(take(1))
          .subscribe(
            (pdfStructure) => {
              const pdfProxy = pdfMake.createPdf(pdfStructure);
              pdfProxy.getBase64((output) => {
                const int8Array: Uint8Array = CdmClinicalSummaryService._base64ToUint8Array(
                  output
                );
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
