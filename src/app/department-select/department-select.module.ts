import { NgModule } from '@angular/core';
import { DepartmentSelectComponent } from '../department-select/department-select.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
      CommonModule
  ],
  exports: [],
  declarations: [
    DepartmentSelectComponent
  ],
  providers: [],
})
export class DepartSelectModule { }
