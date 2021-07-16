import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "myOrderByAlphabetAsc",
  pure: false,
})
export class OrderByAlphabetPipe implements PipeTransform {
  public transform(array: Array<any>): Array<string> {
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
