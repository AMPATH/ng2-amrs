import { MultiDatasetPatientlistReport } from '..//multi-dataset-patientlist.report';

export class Moh731Report extends MultiDatasetPatientlistReport{
    constructor(params) {
        super('MOH731', params)
    }
}