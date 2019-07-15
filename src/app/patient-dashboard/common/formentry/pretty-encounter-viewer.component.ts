import { Component, OnInit, Input, Inject } from '@angular/core';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FormSchemaService } from './form-schema.service';
import { EncounterAdapter, FormFactory, Form, DataSources } from 'ngx-openmrs-formentry';
import { FormDataSourceService } from './form-data-source.service';
import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { Patient } from 'src/app/models/patient.model';

import { flatMap, delay } from 'rxjs/operators';
import { take } from 'rxjs/operators';

@Component({
    selector: 'pretty-encounter-viewer',
    templateUrl: './pretty-encounter-viewer.component.html',
    styleUrls: []
})
export class PrettyEncounterViewerComponent implements OnInit {

    public selectedEncounter: any;
    @Input() set encounter(encounter) {
      if (encounter) {
        this.displayEncounterObs(encounter);
      }
    }
    public form: Form;
    public showLoader: boolean;
    public error: boolean;
    public errorMessage: string;
    public patient: Patient;
    private isHidden: any[];
    private loaderText: string;

    constructor(private encounterResourceService: EncounterResourceService,
        private formSchemaService: FormSchemaService,
        private encounterAdapter: EncounterAdapter,
        private formFactory: FormFactory,
        private fileUploadResourceService: FileUploadResourceService,
        @Inject(DataSources) private dataSources: DataSources,
        private formDataSourceService: FormDataSourceService) { }

    public ngOnInit() {}

    public wireDataSources() {
        this.dataSources.registerDataSource('file', {
            fileUpload: this.fileUploadResourceService.upload.bind(this.fileUploadResourceService),
            fetchFile: this.fileUploadResourceService.getFile.bind(this.fileUploadResourceService)
        });
        this.dataSources.registerDataSource('location',
            this.formDataSourceService.getDataSources()['location']);
        this.dataSources.registerDataSource('provider',
            this.formDataSourceService.getDataSources()['provider']);
        this.dataSources.registerDataSource('drug',
            this.formDataSourceService.getDataSources()['drug']);
        this.dataSources.registerDataSource('problem',
            this.formDataSourceService.getDataSources()['problem']);
        this.dataSources.registerDataSource('personAttribute',
            this.formDataSourceService.getDataSources()['location']);

        this.dataSources.registerDataSource('patientInfo',
            {
              name: this.patient.person.display || '',
              age: this.patient.person.age,
              birthdate: this.patient.person.birthdate,
              mui: this.patient.searchIdentifiers.ampathMrsUId || '',
              nid: this.patient.searchIdentifiers.kenyaNationalId || '',
              mhn: this.patient.openmrsModel.identifiers.find(identifier => identifier.identifierType.name === 'MTRH Hospital Number') ?
                // tslint:disable-next-line:max-line-length
                this.patient.openmrsModel.identifiers.find(identifier => identifier.identifierType.name === 'MTRH Hospital Number').identifier : ''
            });
    }

    public displayEncounterObs(encounter) {
        this.initializeLoader();
        const encounterUuid = encounter.uuid;
        if (this.selectedEncounter) {
            if (encounterUuid === this.selectedEncounter.uuid) { return; }
        }
        this.selectedEncounter = encounter;
        this.form = undefined;
        this.encounterResourceService.getEncounterByUuid(encounterUuid).pipe(
            flatMap((encounterWithObs) => {
                this.patient = new Patient(encounterWithObs.patient);
                this.selectedEncounter = encounterWithObs;
                this.wireDataSources();
                if (encounterWithObs.form) {
                    if (this.isPOCForm(encounterWithObs.form)) {
                        return this.formSchemaService.getFormSchemaByUuid(encounter.form.uuid);
                    } else {
                        this.showErrorMessage(`This encounter was done using an Infopath form.
                                Please use the obs viewer to view the obs for this encounter.`);
                    }
                } else {
                    this.showErrorMessage(`This encounter has no form.`);
                }
            })).pipe(
            take(1)).subscribe((compiledSchema) => {
                const unpopulatedform = this.formFactory.createForm(compiledSchema, this.dataSources);
                this.encounterAdapter.populateForm(unpopulatedform, this.selectedEncounter);
                this.form = unpopulatedform;
                this.showLoader = false;
                this.error = false;
            });
    }

    private isPOCForm(form) {
        return form.name.indexOf('POC') > -1;
    }

    private showErrorMessage(errorMessage: string) {
        this.showLoader = false;
        this.error = true;
        this.errorMessage = errorMessage;
    }

    private initializeLoader() {
        this.error = false;
        this.showLoader = true;
        this.loaderText = `Fetching Encounter...`;
    }
}
