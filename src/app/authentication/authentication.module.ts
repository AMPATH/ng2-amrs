import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authRouting } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { MainDashboardModule } from '../main-dashboard';
import { LoginDialogComponent } from './login-dialog.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';

@NgModule({
  imports: [
    CommonModule,
    authRouting,
    NgamrsSharedModule
  ],
  declarations: [
    LoginComponent,
    LoginDialogComponent
  ],
  providers: [
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthenticationModule { }
