import {
    MultiDatasetPatientlistReport
} from '..//multi-dataset-patientlist.report';
import ReportProcessorHelpersService from '../report-processor-helpers.service';
import {
    Promise
} from 'bluebird';

export class Moh731Report extends MultiDatasetPatientlistReport {
    constructor(params) {
        super('MOH-731-greencard', params)
    }

    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            super.generateReport(additionalParams)
                .then((results) => {
                    // TODO: Process results here
                    let finalResult = []
                    const reportProcessorHelpersService = new ReportProcessorHelpersService();
                    for (let result of results) {
                        if (result.report && result.report.reportSchemas && result.report.reportSchemas.main &&
                            result.report.reportSchemas.main.transFormDirectives.joinColumn) {
                            finalResult = reportProcessorHelpersService.joinDataSets(result.report.reportSchemas.main.transFormDirectives.joinColumn,
                                finalResult, result.results.results.results);
                        }
                    }
                    resolve({
                        rawResults: results,
                        results: finalResult
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}