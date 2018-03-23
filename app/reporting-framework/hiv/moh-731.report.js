import { MultiDatasetPatientlistReport } from '..//multi-dataset-patientlist.report';
import { Promise } from 'bluebird';

export class Moh731Report extends MultiDatasetPatientlistReport{
    constructor(params) {
        super('MOH-731-greencard', params)
    }

    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            super.generateReport(additionalParams)
            .then((results)=>{
                // TODO: Process results here
                resolve(results);
            })
            .catch((error)=>{
                reject(error);
            });
        });
    }
}