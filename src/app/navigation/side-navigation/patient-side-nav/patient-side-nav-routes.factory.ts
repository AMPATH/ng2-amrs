import { Injectable } from '@angular/core';

import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { RouteModel } from '../../../shared/dynamic-route/route.model';
import { Patient } from '../../../models/patient.model';
@Injectable()
export class PatientRoutesFactory {

    constructor(public routesProvider: RoutesProviderService) { }

    public createPatientDashboardRoutes(patient: Patient): RouteModel[] {
        if (patient === null || patient === undefined) {
            throw new Error('patient is requred');
        }

        const patientRoutesConfig: any = this.routesProvider.patientDashboardConfig;
        const routes: RouteModel[] = [];
        if (Array.isArray(patientRoutesConfig['programs'])) {
            for (let program of  patientRoutesConfig.programs) {
                if (program.published && (program.requiresPatientEnrollment === false ||
                    this.patientIsInProgram(program.programUuid,
                        patient.enrolledPrograms))) {
                    routes.push(
                        this.createProgramRouteModel(program, patient.uuid)
                    );
                }
            }
        }

        return routes;
    }

    private createProgramRouteModel(routInfo: any, patientUuid: string): RouteModel {
        const model = new RouteModel();
        model.label = routInfo.programName;
        model.initials = (routInfo.programName as string).charAt(0);
        model.url = 'patient-dashboard/patient/' + patientUuid + '/' + routInfo.baseRoute;
        model.renderingInfo = {
            icon: 'fa fa-square-o'
        };
        this.createProgramChildRoutes(routInfo.routes, model);
        return model;
    }

    private patientIsInProgram(programUuid: string, patientPrograms): boolean {
        if (Array.isArray(patientPrograms)) {
            for (let program of patientPrograms) {
                if (program.programUuid === programUuid) {
                    return true;
                }
            }
        }
        return false;
    }

    private createProgramChildRoutes(routInfo: any[], programRouteModel: RouteModel) {
        programRouteModel.childRoutes = [];
        routInfo.forEach((route) => {
            programRouteModel.childRoutes.push(this.createProgramChildRoute(route,
                programRouteModel));
        });
    }

    private createProgramChildRoute(routInfo: any, programRouteModel: RouteModel): RouteModel {
        const model = new RouteModel();
        model.url = programRouteModel.url + '/' + routInfo.url;
        model.label = routInfo.label;
        model.initials = routInfo.initials || (routInfo.label as string).charAt(0);
        model.renderingInfo = {
            icon: routInfo.icon
        };
        return model;
    }

}
