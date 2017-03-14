import { Injectable } from '@angular/core';

import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { RouteModel } from '../../shared/dynamic-route/route.model';
import { Patient } from '../../models/patient.model';
@Injectable()
export class PatientRoutesFactory {

    constructor(public routesProvider: RoutesProviderService) { }

    createPatientDashboardRoutes(patient: Patient): Array<RouteModel> {
        if (patient === null || patient === undefined) {
            throw new Error('patient is requred');
        }

        let patientRoutesConfig: any = this.routesProvider.patientDashboardConfig;
        let routes: Array<RouteModel> = [];
        if (Array.isArray(patientRoutesConfig['programs'])) {
            for (let i = 0; i < patientRoutesConfig.programs.length; i++) {

                if (patientRoutesConfig.programs[i].requiresPatientEnrollment === false ||
                    this.patientIsInProgram(patientRoutesConfig.programs[i].programUuid,
                        patient.enrolledPrograms)) {
                    routes.push(
                        this.createProgramRouteModel(patientRoutesConfig.programs[i], patient.uuid)
                    );
                }
            }
        }

        return routes;
    }

    private createProgramRouteModel(routInfo: any, patientUuid: string): RouteModel {
        let model = new RouteModel();
        model.label = routInfo.programName;
        model.initials = (routInfo.programName as string).charAt(0);
        model.url = 'patient-dashboard/' + patientUuid + '/' + routInfo.baseRoute;
        model.renderingInfo = {
            icon: 'fa fa-square-o'
        };
        this.createProgramChildRoutes(routInfo.routes, model);
        return model;
    }

    private patientIsInProgram(programUuid: string, patientPrograms): boolean {
        if (Array.isArray(patientPrograms)) {
            for (let i = 0; i < patientPrograms.length; i++) {
                if (patientPrograms[i].program.uuid === programUuid) {
                    return true;
                }
            }
        }
        return false;
    }

    private createProgramChildRoutes(routInfo: Array<any>, programRouteModel: RouteModel) {
        programRouteModel.childRoutes = [];
        routInfo.forEach((route) => {
            programRouteModel.childRoutes.push(this.createProgramChildRoute(route,
                programRouteModel));
        });
    }

    private createProgramChildRoute(routInfo: any, programRouteModel: RouteModel): RouteModel {
        let model = new RouteModel();
        model.url = programRouteModel.url + '/' + routInfo.url;
        model.label = routInfo.label;
        model.initials = routInfo.initials || (routInfo.label as string).charAt(0);
        model.renderingInfo = {
            icon: routInfo.icon
        };
        return model;
    }

}
