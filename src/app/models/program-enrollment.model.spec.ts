import { ProgramEnrollment } from './program-enrollment.model';

import { DatePipe } from '@angular/common';
import { TitleCasePipe } from '../shared/pipes/title-case.pipe';

describe('Model: ProgramEnrollment', () => {
  const existingProgramEnrollment: any = {
    uuid: 'uuid',
    display: 'THe program Enrollment',
    program: {
      uuid: 'program uuid'
    },
    dateEnrolled: '2016-01-01 0:00z',
    dateCompleted: '2016-01-01 0:00z'
  };
  const datePipe = new DatePipe('en-US');
  const titleCasePipe = new TitleCasePipe();
  const dateFormat = 'MMM dd, yyyy';

  it('should wrap openmrs programEnrollment for display correctly', () => {
    const wrappedProgramEnrollment: ProgramEnrollment = new ProgramEnrollment(
      existingProgramEnrollment
    );
    expect(wrappedProgramEnrollment.uuid).toEqual(
      existingProgramEnrollment.uuid
    );
    expect(wrappedProgramEnrollment.display).toEqual(
      titleCasePipe.transform(existingProgramEnrollment.display)
    );
    expect(wrappedProgramEnrollment.program.uuid).toEqual(
      existingProgramEnrollment.program.uuid
    );
    expect(wrappedProgramEnrollment.dateEnrolled as any).toEqual(
      datePipe.transform(existingProgramEnrollment.dateEnrolled, dateFormat)
    );
    expect(wrappedProgramEnrollment.dateCompleted as any).toEqual(
      datePipe.transform(existingProgramEnrollment.dateCompleted, dateFormat)
    );
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
