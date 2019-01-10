import { Component, OnInit, EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core';

@Component({
  selector: 'gender-select',
  templateUrl: './gender-selector.component.html'
})
export class GenderSelectComponent implements OnInit {
  public  selectedGender: Array<any> = [];
  public  genderOptions: Array<any>;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onGenderChange = new EventEmitter<any>();

  constructor() {
  }

  public ngOnInit() {
    if (this.selectedGender.length > 0 ) {
      this.onGenderChange.emit({gender: this.selectedGender});
    }

    this.genderOptions = [
      {
        value: 'F',
        label: 'Female'
      },
      {
        value: 'M',
        label: 'Male'
      }
    ];
  }

  public onGenderSelected(selectedGender) {
    this.selectedGender = selectedGender;
    this.onGenderChange.emit({gender: this.selectedGender});
  }
}
