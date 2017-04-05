import { Component, OnInit, EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'gender-select',
  templateUrl: './gender-selector.component.html'
})
export class GenderSelectComponent implements OnInit {
  selectedGender: Array<any> = [];
  genderOptions: Array<any>;
  @Output() onGenderChange = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
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

  onGenderSelected(selectedGender) {
    this.selectedGender = selectedGender;
    this.onGenderChange.emit({gender: this.selectedGender});
  }
}
