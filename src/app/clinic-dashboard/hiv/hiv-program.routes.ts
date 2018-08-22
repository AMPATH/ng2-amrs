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
import { HivCareComparativeComponent
} from './hiv-visualization/hiv-care-overview.component';
import {
  VisualizationPatientListComponent
} from '../../hiv-care-lib/hiv-visualization/visualization-patient-list.component';
import { Moh731PatientListComponent } from
'./../../hiv-care-lib/moh-731-report/moh-731-patientlist.component';

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
        path: 'moh-731-report/patient-list',
        component: Moh731PatientListComponent
    },
    {
        path: 'hiv-summary-indicator-report',
        children: [
            {
                path: '',
                component: HivSummaryIndicatorComponent
            },
            {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: HivSummaryIndicatorsPatientListComponent,
            }
        ]
    },
    {
        path: 'patients-requiring-vl',
        component: PatientsRequiringVLComponent,
    },
    {
      path: 'hiv-comparative-chart',
      children: [
        {
          path: '',
          component: HivCareComparativeComponent
        },
        {
          path: 'patient-list/:report/:indicator/:period',
          component: VisualizationPatientListComponent
        }

      ]

    },
];

export const clinicDashboardHivRouting: ModuleWithProviders =
    RouterModule.forChild(routes);
