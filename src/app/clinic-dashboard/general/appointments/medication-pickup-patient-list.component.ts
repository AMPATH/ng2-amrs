import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { MedicationDeliveryResourceService } from '../../../etl-api/medication-delivery-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

interface ReportParams {
  locationUuids: string;
  selectedDate: string;
  endDate: string;
}

@Component({
  selector: 'app-medication-pickup-patient-list.component',
  templateUrl: './medication-pickup-patient-list.component.html',
  styleUrls: ['./medication-pickup-patient-list.component.css']
})
export class MedicationPickUpPatientListComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public dailyVisitsPatientList: any[] = [];
  public locationUuids: string;
  public params: any;
  public routeSub: Subscription = new Subscription();
  public loadingpreAppointmentOutreachList = false;

  public selectedDate: string;
  public endDate: string;

  // Pickup statistics
  public completedCount = 0;
  public pendingCount = 0;
  public overdueCount = 0;

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private medicationDeliveryResourceService: MedicationDeliveryResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Set default date to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  public ngOnInit() {
    this.subScribeToClinicLocationChange();
    this.subscribeToRouteParamsChange();
    this.checkQueryParams();
  }

  onEndDateChange() {
    if (this.selectedDate && this.endDate && this.endDate < this.selectedDate) {
      this.errors = [{ message: 'End date cannot be before start date.' }];
      return;
    }
    if (this.errors.length > 0) {
      this.errors = [];
    }
  }

  onDateChange() {
    if (this.selectedDate && this.endDate && this.selectedDate > this.endDate) {
      this.errors = [{ message: 'Start date cannot be after end date.' }];
      return;
    }
    if (this.errors.length > 0) {
      this.errors = [];
    }
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['selectedDate'] && params['locationUuids']) {
        this.selectedDate = params['selectedDate'];
        this.endDate = params['endDate'] || params['selectedDate'];
        this.locationUuids = params['locationUuids'];
        // console.log('locationUuids:', this.locationUuids);
        this.loadMedicationDeliveryData();
      }
    });
  }

  private loadMedicationDeliveryData() {
    if (!this.selectedDate || !this.endDate) {
      this.errors = [
        {
          message:
            'Please select both start and end dates to generate the report.'
        }
      ];
      return;
    }

    if (this.selectedDate > this.endDate) {
      this.errors = [{ message: 'Start date cannot be after end date.' }];
      return;
    }

    this.loadingpreAppointmentOutreachList = true;
    this.errors = [];

    this.medicationDeliveryResourceService
      .getMedicationDeliveryList(
        this.locationUuids,
        this.selectedDate,
        this.endDate
      )
      .subscribe({
        next: (response) => {
          this.loadingpreAppointmentOutreachList = false;
          if (response && response.result) {
            this.dailyVisitsPatientList = this.transformApiData(
              response.result
            );
            this.calculatePickupStats();
          } else {
            this.dailyVisitsPatientList = [];
            this.calculatePickupStats();
          }
        },
        error: (error) => {
          this.loadingpreAppointmentOutreachList = false;
          this.errors = [
            {
              message:
                'Error loading medication delivery data: ' +
                (error.message || 'Unknown error')
            }
          ];
          console.error('Error loading medication delivery data:', error);
        }
      });
  }

  private transformApiData(apiData: any[]): any[] {
    return apiData.map((item) => {
      const formatDate = (dateValue: any): string | null => {
        if (!dateValue) {
          return null;
        }

        const date = new Date(dateValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };

      const pickupDate = formatDate(item.medication_pickup_date);
      const returnDate = formatDate(item['Return to clinic date']);
      const latestVlDate = formatDate(item.latest_vl_date);
      const latestRtcDate = formatDate(item.latest_rtc_date);

      return {
        person_id: item.patient_id,
        uuid: item.person_uuid.toString(),
        given_name: item.given_name || '',
        middle_name: item.middle_name || '',
        family_name: item.family_name || '',
        identifiers: item.identifier || '',
        enrollment_date: formatDate(item.enrollment_date),
        age: item.age || 0,
        gender: item.gender || '',
        phone_number: item.phone_number || '',
        pickup_date: pickupDate,
        prescription_date: pickupDate,
        pickup_status:
          item.pickup_status === 'Picked'
            ? 'Completed'
            : item.pickup_status === 'Not Picked'
            ? 'Pending'
            : item.pickup_status || 'Pending',
        last_pickup_date: pickupDate,
        next_appointment: returnDate,
        patient_id: item.patient_id,
        ccc_number: item.ccc_number,
        upi_number: item.nupi_number,
        return_to_clinic_date: returnDate,
        medication_pickup_date: pickupDate,
        vl_category: item.vl_category || '',
        latest_vl: item.latest_vl,
        latest_vl_date: latestVlDate,
        latest_rtc_date: latestRtcDate,
        cur_meds: item.current_regimen || '',
        health_worker: item.health_worker || ''
      };
    });
  }

  private calculatePickupStats() {
    this.completedCount = this.dailyVisitsPatientList.filter(
      (p) => p.pickup_status === 'Completed'
    ).length;
    this.pendingCount = this.dailyVisitsPatientList.filter(
      (p) => p.pickup_status === 'Pending'
    ).length;
    this.overdueCount = this.dailyVisitsPatientList.filter(
      (p) => p.pickup_status === 'Overdue'
    ).length;
  }

  public extraColumns() {
    return [
      {
        headerName: 'Enrollment Date',
        field: 'enrollment_date',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Phone Number',
        field: 'phone_number',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Medication Delivery Date',
        field: 'pickup_date',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Last Pickup Date',
        field: 'last_pickup_date',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Medication Delivery Status',
        field: 'pickup_status',
        width: 120,
        cellRenderer: (column: any) => {
          const status = column.value;
          let className = '';
          switch (status) {
            case 'Completed':
              className = 'label label-success';
              break;
            case 'Pending':
              className = 'label label-warning';
              break;
            case 'Overdue':
              className = 'label label-danger';
              break;
            default:
              className = 'label label-default';
          }
          return `<span class="${className}">${status}</span>`;
        }
      },
      {
        headerName: 'Peer Name',
        field: 'health_worker',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Latest VL',
        width: 75,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'Return to Clinic Date',
        field: 'next_appointment',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      }
    ];
  }

  public getReportParams(): ReportParams {
    return {
      locationUuids: this.locationUuids,
      selectedDate: this.selectedDate,
      endDate: this.endDate // Add this line
    };
  }

  public generateReport(): void {
    if (!this.selectedDate) {
      this.errors = [
        { message: 'Please select a start date to generate the report.' }
      ];
      return;
    }

    if (!this.endDate) {
      this.errors = [
        { message: 'Please select an end date to generate the report.' }
      ];
      return;
    }

    if (this.selectedDate > this.endDate) {
      this.errors = [{ message: 'Start date cannot be after end date.' }];
      return;
    }

    this.loadMedicationDeliveryData();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        locationUuids: this.locationUuids,
        selectedDate: this.selectedDate,
        endDate: this.endDate
      }
    });
  }

  public subScribeToClinicLocationChange(): void {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
      });
  }

  public subscribeToRouteParamsChange(): void {
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.locationUuids = params['location_uuid'];
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });
  }

  public resetFilter($event: Boolean): void {
    if ($event) {
      this.dailyVisitsPatientList = [];
      this.calculatePickupStats();
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
