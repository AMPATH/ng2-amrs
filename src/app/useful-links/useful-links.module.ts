import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsefulLinksComponent } from './useful-links.component';
import { USEFUL_LINKS_ROUTE } from './useful-links.routes';
import { UsefulLinksService } from './useful-links.service';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(USEFUL_LINKS_ROUTE)],
  declarations: [UsefulLinksComponent],
  providers: [UsefulLinksService],
  exports: [RouterModule]
})
export class UsefulLinksModule {}
