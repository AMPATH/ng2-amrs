import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'snakeCaseToTitle' })
export class SnakeCaseToTitlePipe implements PipeTransform {
  public transform(snakeCaseTitle) {
    return snakeCaseTitle
      .toLowerCase()
      .split('_')
      .map((title) => {
        return title.charAt(0).toUpperCase() + title.slice(1);
      })
      .join(' ');
  }
}
