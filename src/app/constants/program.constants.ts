import { Program } from '../interfaces/program.interface';

const PMTCT_PROGRAM: Program = {
  uuid: '781d897a-1359-11df-a1f1-0026b9348838',
  name: 'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const STANDARD_CARE_MODEL: Program = {
  uuid: 'f0faccb7-657e-413c-abad-54f13409d106',
  name: 'STANDARD CARE MODEL',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const AHD_MODEL: Program = {
  uuid: '4545685e-65f6-48c4-a6b4-860cea88c4d4',
  name: 'ADVANCED HIV DISEASE MODEL',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const VIREMIA_MODEL: Program = {
  uuid: '30521f4d-0708-4644-9e88-a108a830a5fd',
  name: 'VIREMIA MODEL',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};

const STANDARD_HIV_PROGRAM: Program = {
  uuid: '781d85b0-1359-11df-a1f1-0026b9348838',
  name: 'STANDARD HIV TREATMENT',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};

const HIV_DIFFERENTIATED_CARE_PROGRAM: Program = {
  uuid: '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
  name: 'HIV DIFFERENTIATED CARE PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const VIREMIA_PROGRAM: Program = {
  uuid: 'c4246ff0-b081-460c-bcc5-b0678012659e',
  name: 'VIREMIA PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};

const HIV_TRANSIT_PROGRAM: Program = {
  uuid: '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
  name: 'HIV TRANSIT PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const ACTG_PROGRAM: Program = {
  uuid: '4480c782-ef05-4d88-b2f8-c892c99438f6',
  name: 'ACTG PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};

const OVC_PROGRAM: Program = {
  uuid: '781d8768-1359-11df-a1f1-0026b9348838',
  name: 'OVC PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: true
};
const HEI_PROGRAM: Program = {
  uuid: 'a8e7c30d-6d2f-401c-bb52-d4433689a36b',
  name: 'HEI PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const PREP_PROGRAM: Program = {
  uuid: 'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
  name: 'PREP PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const PEP_PROGRAM: Program = {
  uuid: '96047aaf-7ab3-45e9-be6a-b61810fe617d',
  name: 'PEP PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const RESISTANCE_CLINIC_PROGRAM: Program = {
  uuid: 'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31',
  name: 'RESISTANCE CLINIC PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const PHARMACY_PROGRAM: Program = {
  uuid: '8c1a3a68-d91d-488d-8663-ad572673232b',
  name: 'PHARMACY PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const HIV_RETENTION_PROGRAM: Program = {
  uuid: 'c6bf3625-de80-4a88-a913-38273e300a55',
  name: 'HIV RETENTION PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: true
};
const EXPRESS_CARE_PROGRAM: Program = {
  uuid: '781d8880-1359-11df-a1f1-0026b9348838',
  name: 'EXPRESS CARE PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: false
};
const DTG_PHARMACO_VIGILANCE_PROGRAM: Program = {
  uuid: '6ff0a6dc-ef8f-467a-86fc-9d9b263d8761',
  name: 'DTG PHARMACO-VIGILANCE PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: true
};
const HIV_SOCIAL_WORK_PROGRAM: Program = {
  uuid: 'a685c057-d475-42ef-bb33-8b0c1d73b122',
  name: 'HIV SOCIAL WORK PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: true
};
const NUTRITION_PROGRAM: Program = {
  uuid: '03552f68-8233-4793-8353-3db1847bb617',
  name: 'NUTRITION PROGRAM',
  dept: 'HIV',
  compatibleWithOtherDeptPrograms: true
};

export const Programs = {
  PMTCT_PROGRAM,
  STANDARD_HIV_PROGRAM,
  STANDARD_CARE_MODEL,
  AHD_MODEL,
  VIREMIA_MODEL,
  HIV_DIFFERENTIATED_CARE_PROGRAM,
  VIREMIA_PROGRAM,
  HIV_TRANSIT_PROGRAM,
  ACTG_PROGRAM,
  HEI_PROGRAM,
  OVC_PROGRAM,
  PREP_PROGRAM,
  PEP_PROGRAM,
  RESISTANCE_CLINIC_PROGRAM,
  PHARMACY_PROGRAM,
  HIV_RETENTION_PROGRAM,
  EXPRESS_CARE_PROGRAM,
  DTG_PHARMACO_VIGILANCE_PROGRAM,
  HIV_SOCIAL_WORK_PROGRAM,
  NUTRITION_PROGRAM
};
