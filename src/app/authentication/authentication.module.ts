import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authRouting } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { MainDashboardModule } from '../main-dashboard';
import { LoginDialogComponent } from './login-dialog.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';

@NgModule({
  imports: [
    CommonModule,
    authRouting,
    Ng2Bs3ModalModule,
    NgamrsSharedModule
  ],
  declarations: [
    LoginComponent,
    LoginDialogComponent
  ],
  providers: [
    AuthenticationService,
    SessionService
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthenticationModule { }
