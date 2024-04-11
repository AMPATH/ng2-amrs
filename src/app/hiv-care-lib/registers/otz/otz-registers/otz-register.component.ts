import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import { take } from 'rxjs/operators';
import { OtzRegisterService } from 'src/app/etl-api/otz-register.service'; 


@Component({
  selector: 'app-otz-register',
  templateUrl: './otz-register.component.html',
  styleUrls: ['./otz-register.component.css']
})
export class OtzRegisterComponent implements OnInit {
  public otzData = [];
  public enabledControls = 'monthControl';
  public _month: string;
  public vlDate = [];
  public vlResult = [] ;
 
  counterArray = Array(18)
    .fill(0)
    .map((_, index) => index + 1);
    
  counter = Array(8)
    .fill(0)
    .map((_, index) => index + 1);

  constructor(public router: Router, public route: ActivatedRoute, private otzRegisterService: OtzRegisterService) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment()
            .subtract(1, 'M')
            .endOf('month')
            .format('YYYY-MM-DD'))
        : (this._month = data.month);
    });
  }
  public ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
    this.getOtzRegister();
  }

  public getOtzRegister() {
    this.otzRegisterService.getOtzRegister({endDate: this._month, locationUuid: ''})
    // .pipe(take(1))
    .subscribe((result) => {
      this.otzData = result.results.results;
      console.log("otzdata", this.otzData);
      console.log('age2', this.otzData[1].age_at_enrollment);

      for (let data of this.otzData) {
        const viral_load = data.vl_result_post_otz_enrollment;
        const vl_array = viral_load.split(',');
         console.log(vl_array);
          const mapped_vls = vl_array.map((v) => {
        const vl_dates = v.split('=');
        this.vlDate = vl_dates[0];
        this.vlResult = vl_dates[1];
        console.log('Date:', this.vlDate, 'Result:', this.vlResult);
                 return {
                   vlDate: vl_dates[0], 
                        vlResult: vl_dates[1]
                        
              };
             });
             console.log('mapped_vls',mapped_vls);
               

      }
      
    })
    

  }
}
