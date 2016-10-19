import { Routes, RouterModule } from '@angular/router';
import { About } from './about';
import { NoContent } from './no-content';
import { DataResolver } from './app.resolver';
import { AuthGuard } from './shared/guards/auth.guard';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'patient-dashboard/patient-search', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'about', component: About },
  { path: '**',    component: NoContent },
];
