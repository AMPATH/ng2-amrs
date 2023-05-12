export interface ProgramEnrollment {
  dateCompleted: Date;
  dateEnrolled: Date;
  display: string;
  location: any;
  program: {
    uuid: string;
  };
  states: any;
  uuid: string;
  voided: boolean;
}
export interface ProgramCompletionEnrollmentPayload {
  uuid: string;
  dateCompleted: Date;
}

export interface ProgramEnrollmentPayload {
  location: string;
  patient: string;
  dateEnrolled: any;
  program: string;
}
