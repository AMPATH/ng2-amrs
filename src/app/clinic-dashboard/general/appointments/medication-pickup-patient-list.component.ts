import { Component, OnInit } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

interface ReportParams {
  locationUuids: string;
  selectedDate: string;
}

@Component({
  selector: 'app-medication-pickup-patient-list.component',
  templateUrl: './medication-pickup-patient-list.component.html',
  styleUrls: ['./medication-pickup-patient-list.component.css']
})
export class MedicationPickUpPatientListComponent implements OnInit {
  public errors: any[] = [];
  public dailyVisitsPatientList: any[] = [];
  public locationUuids: string;
  public params: any;
  public routeSub: Subscription = new Subscription();
  public loadingpreAppointmentOutreachList = false;

  public selectedDate: string;

  // Pickup statistics
  public completedCount = 0;
  public pendingCount = 0;
  public overdueCount = 0;

  // Mock data for medication pickup patients
  private mockPatientData = [
    {
      person_id: 1001,
      uuid: '6864aa16-536e-4d06-a46b-13f68b044fa2',
      given_name: 'Test',
      middle_name: 'Robs20',
      family_name: 'POC',
      identifiers: '332028278-7 ',
      age: 54,
      gender: 'F',
      phone_number: '+254712345678',
      pickup_date: '2025-05-27',
      medication_name: 'Tenofovir/Lamivudine/Efavirenz',
      prescription_date: '2025-05-20',
      days_supply: 30,
      pickup_status: 'Pending',
      prescribing_clinician: 'Dr. Smith',
      pharmacy_notes: 'Patient prefers morning pickup',
      last_pickup_date: '2025-04-27',
      next_appointment: '2025-06-24',
      adherence_rate: 95.5,
      viral_load: 'Undetectable',
      viral_load_date: '2025-03-15'
    },
    {
      person_id: 1002,
      uuid: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
      given_name: 'Mary',
      middle_name: 'Grace',
      family_name: 'Johnson',
      identifiers: 'MRN-001235',
      age: 32,
      gender: 'F',
      phone_number: '+254723456789',
      pickup_date: '2025-05-27',
      medication_name: 'Dolutegravir/Tenofovir/Lamivudine',
      prescription_date: '2025-05-21',
      days_supply: 30,
      pickup_status: 'Completed',
      prescribing_clinician: 'Dr. Wilson',
      pharmacy_notes: 'Patient educated on side effects',
      last_pickup_date: '2025-04-28',
      next_appointment: '2025-06-25',
      adherence_rate: 98.2,
      viral_load: 'Undetectable',
      viral_load_date: '2025-04-10'
    },
    {
      person_id: 1003,
      uuid: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
      given_name: 'Peter',
      middle_name: 'James',
      family_name: 'Kiprotich',
      identifiers: 'MRN-001236',
      age: 28,
      gender: 'M',
      phone_number: '+254734567890',
      pickup_date: '2025-05-27',
      medication_name: 'Efavirenz/Emtricitabine/Tenofovir',
      prescription_date: '2025-05-19',
      days_supply: 30,
      pickup_status: 'Overdue',
      prescribing_clinician: 'Dr. Brown',
      pharmacy_notes: 'Follow up needed - missed pickup',
      last_pickup_date: '2025-04-25',
      next_appointment: '2025-06-22',
      adherence_rate: 85.7,
      viral_load: '150 copies/ml',
      viral_load_date: '2025-03-28'
    },
    {
      person_id: 1004,
      uuid: 'd4e5f6g7-h8i9-0123-defg-456789012345',
      given_name: 'Sarah',
      middle_name: 'Ann',
      family_name: 'Wanjiku',
      identifiers: 'MRN-001237',
      age: 38,
      gender: 'F',
      phone_number: '+254745678901',
      pickup_date: '2025-05-27',
      medication_name: 'Atazanavir/Ritonavir/Tenofovir/Emtricitabine',
      prescription_date: '2025-05-22',
      days_supply: 30,
      pickup_status: 'Pending',
      prescribing_clinician: 'Dr. Davis',
      pharmacy_notes: 'Take with food',
      last_pickup_date: '2025-04-29',
      next_appointment: '2025-06-26',
      adherence_rate: 92.1,
      viral_load: 'Undetectable',
      viral_load_date: '2025-04-05'
    },
    {
      person_id: 1005,
      uuid: 'e5f6g7h8-i9j0-1234-efgh-567890123456',
      given_name: 'Michael',
      middle_name: 'Ochieng',
      family_name: 'Otieno',
      identifiers: 'MRN-001238',
      age: 52,
      gender: 'M',
      phone_number: '+254756789012',
      pickup_date: '2025-05-27',
      medication_name: 'Rilpivirine/Tenofovir/Emtricitabine',
      prescription_date: '2025-05-18',
      days_supply: 30,
      pickup_status: 'Completed',
      prescribing_clinician: 'Dr. Miller',
      pharmacy_notes: 'Patient counseled on adherence',
      last_pickup_date: '2025-04-26',
      next_appointment: '2025-06-23',
      adherence_rate: 96.8,
      viral_load: 'Undetectable',
      viral_load_date: '2025-03-20'
    }
  ];

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Set default date to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  public ngOnInit() {
    this.subScribeToClinicLocationChange();
    this.subscribeToRouteParamsChange();
    // Don't load data automatically - wait for user to generate report
  }

  onDateChange() {
    console.log('Selected date:', this.selectedDate);
    // Don't auto-filter on date change, wait for generate button click
  }

  private filterPatientsByDate() {
    if (this.selectedDate) {
      this.dailyVisitsPatientList = this.mockPatientData.filter(
        (patient) => patient.pickup_date === this.selectedDate
      );
    } else {
      this.dailyVisitsPatientList = [...this.mockPatientData];
    }
    this.calculatePickupStats();
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
        headerName: 'Pickup Date',
        field: 'pickup_date',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Medication Name',
        field: 'medication_name',
        width: 250,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Prescription Date',
        field: 'prescription_date',
        width: 130,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Days Supply',
        field: 'days_supply',
        width: 100,
        cellRenderer: (column: any) => {
          return column.value + ' days';
        }
      },
      {
        headerName: 'Pickup Status',
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
        headerName: 'Prescribing Clinician',
        field: 'prescribing_clinician',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Phone Number',
        field: 'phone_number',
        width: 130,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Last Pickup Date',
        field: 'last_pickup_date',
        width: 130,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Next Appointment',
        field: 'next_appointment',
        width: 130,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Adherence Rate (%)',
        field: 'adherence_rate',
        width: 130,
        cellRenderer: (column: any) => {
          const rate = column.value;
          let className = '';
          if (rate >= 95) {
            className = 'text-success';
          } else if (rate >= 85) {
            className = 'text-warning';
          } else {
            className = 'text-danger';
          }
          return `<span class="${className}">${rate}%</span>`;
        }
      },
      {
        headerName: 'Viral Load',
        field: 'viral_load',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Viral Load Date',
        field: 'viral_load_date',
        width: 130,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Pharmacy Notes',
        field: 'pharmacy_notes',
        width: 200,
        cellStyle: {
          'white-space': 'normal'
        }
      }
    ];
  }

  public getReportParams(): ReportParams {
    return {
      locationUuids: this.locationUuids,
      selectedDate: this.selectedDate
    };
  }

  public generateReport(): void {
    if (this.locationUuids && this.selectedDate) {
      this.loadingpreAppointmentOutreachList = true;

      // Simulate API call with setTimeout
      setTimeout(() => {
        this.loadingpreAppointmentOutreachList = false;
        this.filterPatientsByDate();

        // Update URL with query parameters
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            locationUuids: this.locationUuids,
            selectedDate: this.selectedDate
          }
        });
      }, 1000); // Simulate 1 second loading time
    }
  }

  public subScribeToClinicLocationChange(): void {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
        // Don't auto-generate report on location change
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
    }
  }
}
