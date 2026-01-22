export class PatientListColumns {
  public static columns() {
    return [
      {
        headerName: '#',
        width: 60,
        pinned: true,
        cellRenderer: (column) => {
          // initial ordering of patients
          return parseInt(column.node.rowIndex, 10) + 1;
        },
        field: '#'
      },
      {
        headerName: 'CCC Number',
        width: 150,
        field: 'ccc_number',
        pinned: true
      },
      {
        headerName: 'Person Name',
        width: 120,
        field: 'person_name',
        cellStyle: {
          'white-space': 'normal'
        },
        pinned: true,
        filter: 'text'
      },
      {
        headerName: 'NUPI Identifier',
        width: 150,
        field: 'upi_number',
        pinned: true
      },
      {
        headerName: 'CR',
        width: 150,
        field: 'cr_id',
        pinned: true
      },
      {
        headerName: 'SHA',
        width: 150,
        field: 'sha_id',
        pinned: true
      },
      {
        headerName: 'Gender',
        width: 75,
        field: 'gender'
      },
      {
        headerName: 'Age',
        width: 60,
        field: 'age'
      },
      {
        headerName: 'Identifiers',
        field: 'identifiers',
        width: 150,
        cellStyle: {
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis'
        },
        filter: 'text',
        cellClass: 'identifier-column'
      }
    ];
  }

  public static hivColumns() {
    return [
      {
        headerName: 'VL Category',
        width: 150,
        field: 'vl_category'
      },
      {
        headerName: 'Phone Number',
        width: 150,
        field: 'phone_number'
      },
      {
        headerName: 'Latest Appointment',
        width: 200,
        field: 'last_appointment'
      },
      {
        headerName: 'Patient Category',
        width: 150,
        field: 'patient_category'
      },
      {
        headerName: 'Visit Type',
        width: 200,
        field: 'visit_type'
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Med Pickup RTC',
        width: 150,
        field: 'med_pick_up_date'
      },
      {
        headerName: 'OVCID',
        width: 200,
        field: 'ovcid_id'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      },
      {
        headerName: 'Previous VL',
        width: 75,
        field: 'previous_vl'
      },
      {
        headerName: 'Previous VL Date',
        width: 150,
        field: 'previous_vl_date'
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      }
    ];
  }
}
