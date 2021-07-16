import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AppSettingsComponent } from "./app-settings.component";
import { RouterModule } from "@angular/router";
import { APP_SETTINGS_ROUTES } from "./app-settings.routes";
import { UtilsModule } from "../utils/utils.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AppSettingsService } from "./app-settings.service";
import { CookieService } from "ngx-cookie";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    UtilsModule,
    BsDropdownModule,
    RouterModule.forChild(APP_SETTINGS_ROUTES),
  ],
  declarations: [AppSettingsComponent],
  providers: [AppSettingsService, CookieService],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppSettingsModule {}
