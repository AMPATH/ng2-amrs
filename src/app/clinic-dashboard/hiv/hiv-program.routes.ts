import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import {
    HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';
import {
    HivSummaryIndicatorsPatientListComponent
} from '../../hiv-care-lib/hiv-summary-indicators/patient-list.component';
import {
    PatientsRequiringVLComponent
} from './patients-requiring-vl/patients-requiring-vl.component';

const routes: Routes = [
    {
        path: 'landing-page',
        component: Moh731ReportComponent // replace with landing page for module
    },
    {
        path: 'moh-731-report',
        component: Moh731ReportComponent // replace with landing page for module
    },
    {
        path: 'hiv-summary-indicator-report',
        children: [
            {
                path: '',
                component: HivSummaryIndicatorComponent
            },
            {
                path: 'patient-list/:indicator/:period/:gender/:age',
                component: HivSummaryIndicatorsPatientListComponent,
            }
        ]
    },
    {
        path: 'patients-requiring-vl',
        component: PatientsRequiringVLComponent,
    }
];

export const clinicDashboardHivRouting: ModuleWithProviders =
    RouterModule.forChild(routes);
