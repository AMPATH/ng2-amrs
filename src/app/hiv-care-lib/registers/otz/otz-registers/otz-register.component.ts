import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-otz-register',
  templateUrl: './otz-register.component.html',
  styleUrls: ['./otz-register.component.css']
})
export class OtzRegisterComponent implements OnInit {
  constructor(public router: Router, public route: ActivatedRoute) {}

  public ngOnInit() {}
}
