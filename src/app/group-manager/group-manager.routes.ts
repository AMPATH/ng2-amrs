import { RouterModule, Routes } from '@angular/router';
import { GroupManagerSearchComponent } from './group-manager-search/group-manager-search.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { ModuleWithProviders } from '@angular/core';

const childRoutes = [
  {path: '', component: GroupManagerSearchComponent},
  {path: 'group/:uuid', component: GroupDetailComponent }
];

export const routes: Routes = [
    {path: 'group-manager', children: childRoutes}
];

export const GroupManagerRouting: ModuleWithProviders = RouterModule.forChild(routes);
