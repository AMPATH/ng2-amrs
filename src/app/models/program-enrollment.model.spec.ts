import { ProgramEnrollment } from './program-enrollment.model';

import { DatePipe } from '@angular/common';
import { TitleCasePipe } from '../shared/pipes/title-case.pipe';
describe('Model: ProgramEnrollment', () => {

  let existingProgramEnrollment: any = {
    uuid: 'uuid',
    display: 'THe program Enrollment',
    program: {
      uuid: 'program uuid'
    },
    dateEnrolled: '2016-01-01 0:00z',
    dateCompleted: '2016-01-01 0:00z'

  };
  let datePipe = new DatePipe('en-US');
  let titleCasePipe = new TitleCasePipe();
  let dateFormat: string = 'MMM dd, yyyy';

  it('should wrap openmrs programEnrollment for display correctly', () => {
    let wrappedProgramEnrollment: ProgramEnrollment
      = new ProgramEnrollment(existingProgramEnrollment);
    expect(wrappedProgramEnrollment.uuid).toEqual(existingProgramEnrollment.uuid);
    expect(wrappedProgramEnrollment.display).toEqual(
      titleCasePipe.transform(existingProgramEnrollment.display));
    expect(wrappedProgramEnrollment.program.uuid).toEqual(existingProgramEnrollment.program.uuid);
    expect(wrappedProgramEnrollment.dateEnrolled)
      .toEqual(
      datePipe.transform(existingProgramEnrollment.dateEnrolled, dateFormat));
    expect(wrappedProgramEnrollment.dateCompleted)
      .toEqual(datePipe.transform(existingProgramEnrollment.dateCompleted, dateFormat));
    // datePipe.transform(existingProgramEnrollment.dateCompleted, dateFormat)
    // TODO implement these tests
    /*it('should generate update existing payload correctly',()=>{

     });

     it('should generate a new Program new payload correctly', ()=>{


     });

     it('should generate an existing Program payload correctly', ()=>{

     });*/
  });
});

