import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { FeedBackComponent } from './feedback';

export const ROUTES: Routes = [
  {
    path: '', loadChildren: './main-dashboard/main-dashboard.module#MainDashboardModule'
  },
   {
    path: 'login', loadChildren: './authentication/authentication.module#AuthenticationModule'
  },
  { path: 'about', component: AboutComponent },
  { path: 'feed-back', component: FeedBackComponent },
  { path: '**', component: NoContentComponent },
];
