import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../../openmrs-api/user.service';
import { RoleUuids } from '../../constants/role.contants';

@Injectable()
export class IsClinicalStaffViewerGuard implements CanActivate {
  constructor(private userService: UserService) {}

  public canActivate() {
    return this.userService.hasRole(RoleUuids.CLINICAL_STAFF_VIEWER.name);
  }
}
