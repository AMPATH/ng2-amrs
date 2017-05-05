import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import {
  HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';

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
      component: HivSummaryIndicatorComponent // replace with landing page for module
    }
];

export const clinicDashboardHivRouting: ModuleWithProviders =
    RouterModule.forChild(routes);
