import { GroupByPriority } from './group-by-priority.pipe';

describe('Pipe: GroupByPriority', () => {

  let pipe: GroupByPriority;
  const availablePrograms: Array<any> = [
    {uuid: 'sdhsdhdgshhjgdsd', name: 'PrEP PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'HIV TRANSIT PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'TURBO DIFFERENTIATED CARE PILOT PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'VIREMIA PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'HIV SOCIAL WORK PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'PHARMACOVIGILANCE PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'RESISTANCE CLINIC PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'HEI PROGRAM'},
    {uuid: 'sdhsdhdgshhjgdsd', name: 'HIV COMMUNITY BASED CARE RESEARCH PROGRAM'},
    {uuid: 'sdhsdhdgshddjgdsd', name: 'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV'},
    {uuid: 'sdhsdhdgshsjgdsd', name: 'STANDARD HIV TREATMENT'}
  ];

  const expectedSortedPrograms: Array<any> = [
    {name: 'STANDARD HIV TREATMENT', uuid: 'sdhsdhdgshsjgdsd', priority: 1},
    {name: 'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV', uuid: 'sdhsdhdgshddjgdsd', priority: 2},
    {name: 'VIREMIA PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 4},
    {name: 'PrEP PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'HIV TRANSIT PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'TURBO DIFFERENTIATED CARE PILOT PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'HIV SOCIAL WORK PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'PHARMACOVIGILANCE PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'RESISTANCE CLINIC PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'HEI PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000},
    {name: 'HIV COMMUNITY BASED CARE RESEARCH PROGRAM', uuid: 'sdhsdhdgshhjgdsd', priority: 1000}];

  beforeEach(() => {
    pipe = new GroupByPriority();
  });

  afterEach(() => {
    pipe = null;
  });

  it('It should have the same length', (done) => {
    expect(availablePrograms.length).toBe(expectedSortedPrograms.length);
    done();
  });

  it('It should sort available HIV programs starting with the highest priority', (done) => {
    const transformPrograms: Array<any> = pipe.transform(availablePrograms);
    expect(transformPrograms).toBe(transformPrograms);
    done();
  });

});
