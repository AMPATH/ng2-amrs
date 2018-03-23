import { Promise } from 'bluebird';
import { MultiDatasetReport } from './multi-dataset.report';
import { PatientlistMysqlReport } from './patientlist-mysql.report';

export class MultiDatasetPatientlistReport extends MultiDatasetReport {
    constructor(reportName, params) {
        super(reportName, params);
    }

    generatePatientListReport(indicators) {
        let additionalParams = {
            type: 'patient-list',
            indicators: indicators
        };

        return this.generateReport(additionalParams);
    }

    getReportHandler(reportName, params) {
        return new PatientlistMysqlReport(reportName, params);
    }

    runSingleReport(reportObject, additionalParams) {
        if(additionalParams && additionalParams.type === 'patient-list') {
            reportObject.generatePatientListReport(additionalParams.indicators);
        }
        return reportObject.generateReport();
    }
}