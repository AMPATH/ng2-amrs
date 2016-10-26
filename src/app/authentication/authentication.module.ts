import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authRouting } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { LoginDialogComponent } from './login-dialog.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
  imports: [
    CommonModule,
    authRouting,
    Ng2Bs3ModalModule
  ],
  declarations: [
    LoginComponent,
    LoginDialogComponent
  ],
  providers: [],
  exports: [
    LoginComponent
  ]
})
export class AuthenticationModule {  }
