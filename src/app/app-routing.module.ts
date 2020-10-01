import { FormVisitTypeSearchComponent } from './patient-dashboard/common/form-visit-type-search/form-visit-type-search.component';
import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { FeedBackComponent } from './feedback';

export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: './main-dashboard/main-dashboard.module#MainDashboardModule'
  },
  {
    path: 'login',
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  },
  { path: 'feed-back', component: FeedBackComponent },
  {
    path: 'form-visit-search',
    loadChildren:
      './patient-dashboard/common/form-visit-type-search/form-visit-type-search.module#FormVisitTypeSearchModule'
  },
  { path: '**', component: NoContentComponent }
];
