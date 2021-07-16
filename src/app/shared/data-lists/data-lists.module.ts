import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgGridModule } from "ag-grid-angular/main";
import { GenericListComponent } from "./generic-list/generic-list.component";
import { PatientListComponent } from "./patient-list/patient-list.component";

@NgModule({
  imports: [AgGridModule.withComponents([])],
  declarations: [GenericListComponent, PatientListComponent],
  exports: [GenericListComponent, PatientListComponent],
})
export class DataListsModule {}
