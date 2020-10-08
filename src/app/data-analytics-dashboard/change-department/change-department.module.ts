import { NgModule } from '@angular/core';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [ChangeDepartmentComponent],
  declarations: [ChangeDepartmentComponent],
  providers: []
})
export class ChangeDepartmentModule {}
