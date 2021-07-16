import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NgamrsSharedModule } from "../../shared/ngamrs-shared.module";
import { DermatologyLandingPageComponent } from "./landing-page/landing-page.component";

import { Http, XHRBackend, RequestOptions } from "@angular/http";
import { Router } from "@angular/router";
import { SessionStorageService } from "../../utils/session-storage.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { PocHttpInteceptor } from "src/app/shared/services/poc-http-interceptor";

@NgModule({
  imports: [CommonModule, FormsModule, NgamrsSharedModule, HttpClientModule],
  exports: [DermatologyLandingPageComponent],
  declarations: [DermatologyLandingPageComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true,
    },
  ],
})
export class PatientDashboardDermatologyModule {}
