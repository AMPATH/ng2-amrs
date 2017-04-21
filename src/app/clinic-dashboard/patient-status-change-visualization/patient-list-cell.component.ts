import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'patient-list-cell',
    templateUrl: 'patient-list-cell.component.html'
})

export class PatientlistCellComponent {
    private params: any;
    constructor(private router: Router, private route: ActivatedRoute) { }
    agInit(params: any): void {
        this.params = params;
    }
    clicked() {
        this.router.navigate(['/patient-dashboard/' +
            this.params.data.patient_uuid + '/general/landing-page']);
    }
}
