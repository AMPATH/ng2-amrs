import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'referral-status',
  templateUrl: './referral-status.component.html',
  styleUrls: ['./referral-status.component.css']
})
export class ReferralStatusComponent implements OnInit {
  @Input()
  public status: any = undefined;

  public ngOnInit() {

  }

}
