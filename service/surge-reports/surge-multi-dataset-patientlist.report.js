import { Promise } from 'bluebird';
import { MultiDatasetReport } from '../../app/reporting-framework/multi-dataset.report';

export class SurgeMultiDatasetPatientlistReport extends MultiDatasetReport {

    constructor(reportName, params) {
        super(reportName, params);
    }
    generatePatientListReport(indicators) {
        let additionalParams = {
            type: 'patient-list',
            indicators: indicators
        };
        let that = this;
        return new Promise((resolve, reject) => {
            this.generateReport(additionalParams).
                then((results) => {
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].results && results[i].results.results && results[i].results.results.results) {
                            resolve({
                                result: results[i].results.results.results,
                                queriesAndSchemas: results[i],
                                indicators: indicators,
                                size: that.params.limit,
                                startIndex: that.params.startIndex,
                                allResults: results
                            });
                            break;
                        }
                    }
                    reject('Patientlist error:', results);
                }).catch((err) => {
                    console.error('Patientlist Error', err);
                    reject(err);
                });
        });
    }
}
