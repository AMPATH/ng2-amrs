
import { Component, OnInit , Input , OnChanges , SimpleChanges, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { CaseManagementResourceService } from './../../etl-api/case-management-resource.service';




@Component({
    selector: 'case-management',
    templateUrl: './case-management.component.html',
    styleUrls: ['./case-management.component.css']
})

export class CaseManagementComponent implements OnInit {

    public title = 'Case Management';
    public patientList = [];
    public indicatorDefinitions = [];
    public modalRef: BsModalRef;
    public params: any;
    public assignCaseManager = false;
    @Input() public locationUuids: any;
    @Input() public dashboardType: String;
    public busyIndicator: any = {
      busy: false,
      message: 'Please wait...' // default message
    };
    public errorObj = {
      'isError': false,
      'message': ''
    };

    constructor(
        private route: ActivatedRoute,
        private caseManagementResourceService: CaseManagementResourceService,
        private modalService: BsModalService) {
    }

    public ngOnInit() {

    this.route
    .queryParams
    .subscribe((params: any) => {
        if (params) {
            this.patientList = params;
          if (params.filterSet === 'true') {
            this.getPatientList(params);
           }
          this.params = params;
          if (params.hasCaseManager) {
            this.toggleAssignCase(params.hasCaseManager);
          }
        }
      }, (error) => {
        console.error('Error', error);
      });

      this.getIndicatorDefinitions();

    }

    public toggleAssignCase(hasCaseManager) {
         switch (hasCaseManager) {
             case 'true':
                this.assignCaseManager = false;
                break;
            case 'false':
                this.assignCaseManager = true;
                break;
            default:
               this.assignCaseManager = this.patientList.length > 0 ? true : false;
         }
    }



    public getPatientList(params) {
        this.loading();
        this.resetErrorMsg();
        this.caseManagementResourceService.getCaseManagementList(params)
        .subscribe((results: any) => {
           this.patientList = results.result;
           this.endLoading();
        }, (err) => {
          this.endLoading();
          this.errorObj = {
            'isError': true,
            'message': 'An error occurred while trying to load the report.Please reload page'
          };
        });
    }

    public getIndicatorDefinitions() {

      this.caseManagementResourceService.getIndicatorDefinitions()
      .subscribe((results: any) => {
        this.indicatorDefinitions = results.indicators;
      });
    }

    public loading() {
      this.busyIndicator = {
        busy: true,
        message: 'Fetching report...please wait'
      };
    }

    public endLoading() {
        this.busyIndicator = {
          busy: false,
          message: ''
        };
    }
    public resetErrorMsg() {
      this.errorObj = {
        'isError': false,
        'message': ''
      };
     }

     public filterReset($event) {
      this.patientList = [];
     }

     public updatePatientList($event) {
        if ($event === true) {
             this.getPatientList(this.params);
        } else {
          this.getPatientList($event);
        }

     }

     public showModal(modal: TemplateRef<any>) {
      this.modalRef = this.modalService.show(modal);
     }


}
