import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HolidaysResourceService {
  constructor(protected http: HttpClient) {}

  public getKenyaHolidays() {
    return this.http.get('https://ngx.ampath.or.ke/kenya_holidays.json');
  }
}
