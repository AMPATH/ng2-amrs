import { Routes, RouterModule } from '@angular/router';
import { About } from './about';
import { NoContent } from './no-content';
import { AppComponent } from './app.component';
import { FeedBackComponent } from './feedback';
import { DataResolver } from './app.resolver';
import { AuthGuard } from './shared/guards/auth.guard';

export const ROUTES: Routes = [
  {
    path: '', loadChildren: './main-dashboard/main-dashboard.module#MainDashboardModule'
  },
   {
    path: 'login', loadChildren: './authentication/authentication.module#AuthenticationModule'
  },
  { path: 'about', component: About },
  { path: 'feed-back', component: FeedBackComponent },
  { path: '**', component: NoContent },
];
