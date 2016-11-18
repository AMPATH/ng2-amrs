import { ProgramEnrollment } from './program-enrollment.model';


describe('Model: ProgramEnrollment', () => {

  let existingProgramEnrollment: any = {
    uuid: 'uuid',
    display: 'the programEnrollment',
    program: {
      uuid: 'program uuid'
    },
    dateEnrolled: '2016-01-01 0:00z',
    dateCompleted: '2016-01-01 0:00z'

  };

  it('should wrap openmrs programEnrollment for display correctly', () => {
    let wrappedProgramEnrollment: ProgramEnrollment
      = new ProgramEnrollment(existingProgramEnrollment);
    expect(wrappedProgramEnrollment.uuid).toEqual(existingProgramEnrollment.uuid);
    expect(wrappedProgramEnrollment.display).toEqual(existingProgramEnrollment.display);
    expect(wrappedProgramEnrollment.program.uuid).toEqual(existingProgramEnrollment.program.uuid);
    expect(wrappedProgramEnrollment.dateEnrolled)
      .toEqual(new Date(existingProgramEnrollment.dateEnrolled));
    expect(wrappedProgramEnrollment.dateCompleted)
      .toEqual(new Date(existingProgramEnrollment.dateCompleted));

  });

  // TODO implement these tests
  /*it('should generate update existing payload correctly',()=>{

   });

   it('should generate a new Program new payload correctly', ()=>{


   });

   it('should generate an existing Program payload correctly', ()=>{

   });*/

});


