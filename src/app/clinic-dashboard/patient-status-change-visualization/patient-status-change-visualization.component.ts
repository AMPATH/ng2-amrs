import {
    Component, OnInit, Input, AfterViewInit,
    ChangeDetectorRef, OnChanges, SimpleChanges
} from '@angular/core';
import { PatientStatuChangeVisualizationService }
    from './patient-status-change-visualization.service';

@Component({
    selector: 'patient-status-change-visualization',
    templateUrl: './patient-status-change-visualization.component.html',
    providers: [PatientStatuChangeVisualizationService],
    styleUrls: ['./patient-status-change-visualization.component.css']
})

export class PatientStatusChangeVisualizationComponent implements OnInit, OnChanges {
    @Input()
    lineIndicators = [];
    @Input()
    barIndicators = [];
    @Input()
    data = [];
    chartOptions: any;
    columns = [];
    constructor(
        private patientStatuChangeVisualizationService: PatientStatuChangeVisualizationService) {

    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.chartOptions = this.patientStatuChangeVisualizationService.generateChart({
                lineIndicators: this.lineIndicators,
                barIndicators: this.barIndicators, data: this.data
            });
        }
    }
    ngOnInit() {
        this.chartOptions = this.patientStatuChangeVisualizationService.generateChart({
            lineIndicators: this.lineIndicators,
            barIndicators: this.barIndicators, data: this.data
        });
        this.columns = this.patientStatuChangeVisualizationService.generateColumDefinations();
    }

}
