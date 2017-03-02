
export class PatientListColumns {

  public static columns() {

    return [
      {
          headerName: '#',
          field: '#'
      },
      {
          headerName: 'Identifiers',
          field: 'identifiers'
      },
      {
          headerName: 'Person Name',
          field: 'person_name'
      },
      {
          headerName: 'Gender',
          field: 'gender'
      },
      {
          headerName: 'Age',
          field: 'age'
      }
    ];
  }
}
