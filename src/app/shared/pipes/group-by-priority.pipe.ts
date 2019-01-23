import {Pipe, PipeTransform} from '@angular/core';
import {Program} from '../../models/program.model';

@Pipe({name: 'GroupByPriority'})

export class GroupByPriority implements PipeTransform {
  transform(collection: Array<Program>): Array<any> {
    if (!collection) {
      return null;
    }

/*   1. STANDARD HIV TREATMENT
     2. PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV
     3. HIV DIFFERENTIATED CARE PROGRAM
     4. VIREMIA PROGRAM
     5. the rest arrange random or alphabetically */

    const sorted_programs: Array<SortingProgramInterface> = [];
    collection.forEach(program => {
      switch (program.name) {
        case 'STANDARD HIV TREATMENT':
          sorted_programs.push({name: program.name, uuid: program.uuid, priority: 1});
          break;
        case 'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV':
          sorted_programs.push({name: program.name, uuid: program.uuid, priority: 2});
          break;
        case 'HIV DIFFERENTIATED CARE PROGRAM':
          sorted_programs.push({name: program.name, uuid: program.uuid, priority: 3});
          break;
        case 'VIREMIA PROGRAM':
          sorted_programs.push({name: program.name, uuid: program.uuid, priority: 4});
          break;
        default:
          sorted_programs.push({name: program.name, uuid: program.uuid, priority: 1000});
      }
    });
    sorted_programs.sort((a, b) => a.priority - b.priority);

    return sorted_programs;
  }
}

export interface SortingProgramInterface {
  uuid: string;
  priority: number;
  name: string;
}
