import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { FormListService } from '../forms/form-list.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';

@Component({
    selector: 'form-visit-type-search',
    templateUrl: './form-visit-type-search.component.html',
    styleUrls: ['./form-visit-type-search.component.css']
})

export class FormVisitTypeSearchComponent implements OnInit, OnDestroy {

    public programVisitConfig: any[];
    public mainFilterType = '';
    public visitTypeList: any = [];
    public allFormsList: any[];
    public formList: any = [];
    public encounterTypeList: any = [];
    public secondFilters: any = [];
    public selectedFilterArray: any = [];
    public showVisitResults = false;
    public showFormResults = false;
    public visitTypeResult: any = [];
    public formTypeResult: any = [];
    public secondaryFilter: any;

    constructor(
        private _formListService: FormListService,
        private _patientProgramService: PatientProgramResourceService) { }

    public ngOnInit() {
        this.getProgramsVisitConfig();
        // console.log('Form List', formList);
        this.getallFormsList();
    }
    public ngOnDestroy() {

    }

    public getProgramsVisitConfig() {

        this._patientProgramService.getAllProgramVisitConfigs()
            .subscribe((response) => {
                if (response) {
                    this.programVisitConfig = JSON.parse(JSON.stringify(response));
                    this.sortVisitList();
                }
            });

    }

    public selectMainFilter($event) {
        const mainFilter = $event.target.value;

        if (mainFilter === 'visitType') {
            this.secondFilters = _.uniq(this.visitTypeList);
            this.showVisitResults = true;
            this.showFormResults = false;
        } else if (mainFilter === 'form') {
            this.secondFilters = _.uniq(this.formList);
            this.showFormResults = true;
            this.showVisitResults = false;
        } else {
            this.secondFilters = [];
        }

        this.selectedFilterArray = [];

    }

    public selectSecondaryFilter(secondaryFilter) {

        if (secondaryFilter === 'all') {
            /*  if one has selected all as the second filter
                then load the selected filter array with all
                the options
            */
            const secondFilters = _.uniq(this.secondFilters);
            this.selectedFilterArray = secondFilters;

        } else {

            const secondFilter = secondaryFilter;
            this.selectedFilterArray.push(secondFilter);

        }

        this.getResultData();

    }

    public getallFormsList() {

        this._formListService.getFormList().subscribe((formList) => {
            if (formList) {
                this.allFormsList = formList;

                this.sortFormsList(formList);
            }
        });

    }

    public sortFormsList(allForms) {

        const formTrackArray = [];

        if (allForms.length > 0) {
            _.each(allForms, (form: any, index) => {
                // console.log('form', form);
                if (_.includes(formTrackArray, form.encounterType.uuid) === false) {

                    this.formList.push({
                        'uuid': form.encounterType.uuid,
                        'name': form.display

                    });

                    formTrackArray.push(form.encounterType.uuid);

                }
            });

            this.orderFilterByAlphabetAsc(this.formList);
        }

    }

    public orderFilterByAlphabetAsc(filter) {

        filter.sort((a: any, b: any) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });
        return filter;

    }

    public removeFilterItem(i) {
        this.selectedFilterArray.splice(i, 1);
        this.getResultData();
    }
    public clearSelectedFilter() {
        this.selectedFilterArray = [];
        this.getResultData();
    }

    private sortVisitList() {

        const programVisitConfig = this.programVisitConfig;
        const visitTrackArray = [];

        _.each(programVisitConfig, (program: any) => {
            const visitTypes = program.visitTypes;

            _.each(visitTypes, (visitType: any) => {

                const encounterTypes = visitType.encounterTypes;
                // console.log('Visit Type', visitType);
                if (_.includes(visitTrackArray, visitType.uuid) === false) {

                    this.visitTypeList.push({
                        'uuid': visitType.uuid,
                        'name': visitType.name

                    });

                    visitTrackArray.push(visitType.uuid);

                }
            });

            this.orderFilterByAlphabetAsc(this.visitTypeList);
        });

    }

    private getResultData() {

        const programsVisitConf = this.programVisitConfig;
        const selectedFilterArray = this.selectedFilterArray;
        this.visitTypeResult = [];
        this.formTypeResult = [];
        const formResult = [];
        const mainFilter = this.mainFilterType;
        const formTrackArray = [];

        _.each(selectedFilterArray, (filterItem: any) => {
            const uuid = filterItem.uuid;
            const name = filterItem.name;
            _.each(programsVisitConf, (visitProgram: any) => {
                const program = visitProgram.name;
                const visitTypes = visitProgram.visitTypes;
                _.each(visitTypes, (visitType: any) => {
                    const visitUuid = visitType.uuid;
                    const visitTypeName = visitType.name;
                    const allowedIf = visitType.allowedIf;
                    const reason = visitType.message;
                    const encounterTypes = visitType.encounterTypes;
                    if (mainFilter === 'visitType') {

                        if (uuid === visitUuid) {
                            this.visitTypeResult.push({
                                'program': program,
                                'visitType': visitTypeName,
                                'encounterType': encounterTypes,
                                'condition': reason
                            });

                        }

                    }

                    if (mainFilter === 'form') {

                        // loop through encounters
                        _.each(encounterTypes, (encounterType: any) => {
                            // console.log('Form selected');
                            const encounterUuid = encounterType.uuid;
                            const encounterName = encounterType.display;

                            // console.log('Form Result', formResult);

                            if (_.includes(formTrackArray, encounterUuid) === false) {
                                if (encounterUuid === uuid) {

                                    this.formTypeResult.push({
                                        'form': name,
                                        'formUuid': encounterUuid,
                                        'program': program,
                                        'visitType': [visitTypeName],
                                        'condition': reason
                                    });

                                    formTrackArray.push(encounterUuid);

                                }

                            } else {

                                // console.log('Contains encounter uuid');

                                _.each(this.formTypeResult, (form: any, index) => {
                                    const formUuid = form.formUuid;
                                    if (formUuid === uuid) {

                                        form.visitType.push(visitTypeName);

                                    }
                                });

                            }

                        });

                    }

                });
            });
        });

    }

}
